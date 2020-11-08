import { CameraOutlined, DeleteOutlined, KeyOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, List, message, Modal, Popconfirm, Table } from 'antd';
import Axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/dashboard.module.css';
import Navbar from './navbar';
import Spoiler from './spoiler';

export default function Dashboard({ userProp, imagesProp, router }) {
  const initialState = {
    showInviteManager: false,
    user: userProp,
    visiblePopConfirm: '',
    images: imagesProp,
    loading: true,
  };

  const [{ showInviteManager, user, visiblePopConfirm, images }, setState] = useState(initialState);

  const manageInvites = () => {
    if (
      user.invites <= 0 &&
      user.createdInvites.filter((x: { useable: boolean }) => x.useable !== false)
        .length <= 0
    )
      return message.error('You do not have any invites.');

    setState((state) => ({ ...state, showInviteManager: true }));
  };

  const hideInviteManager = () => {
    setState((state) => ({ ...state, showInviteManager: false }));
  };


  const createInvite = async () => {
    const invites = user.invites;

    if (invites <= 0) return message.error('You do not have any invites.');

    try {
      const { data } = await Axios.post(
        'http://localhost:3001/invites',
        {},
        {
          withCredentials: true,
        }
      );
      const newInvites = [];

      for (const invite of data.invites) {
        newInvites.push({
          code: invite.code,
          dateCreated: new Date().toLocaleDateString(),
        });
      }

      setState((state) => ({
        ...state,
        user: {
          ...user,
          createdInvites: user.createdInvites.concat(newInvites),
          invites: user.invites - 1,
        },
      }));
      message.success('Created invite successfully');
    } catch (err) {
      message.error(err.response.data.error);
    }
  };


  const handleDelete = async (record: any) => {
    try {
      if (!user.createdInvites) return;

      await Axios.delete(`http://localhost:3001/invites/${record.code}`);

      setState((state) => ({
        ...state,
        user: {
          ...user,
          createdInvites: user.createdInvites.filter(
            (x: any) => x.code !== record.code
          ),
        },
      }));

      message.success('Deleted invite successfully');
    } catch (err) {
      message.error(err.response.data.error);
    }
  };


  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Created on',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: any) => {
        return (
          <Popconfirm
            visible={record.code === visiblePopConfirm}
            title="Are you sure you want to delete this invite?"
            okText="Yes"
            onCancel={() =>
              setState((state) => ({ ...state, visiblePopConfirm: '' }))
            }
            okButtonProps={{
              style: { backgroundColor: '#444444', border: 'none' },
            }}
            onConfirm={async () => await handleDelete(record)}
          >
            <Button
              onClick={() =>
                setState((state) => ({
                  ...state,
                  visiblePopConfirm: record.code,
                }))
              }
            >
              Delete
            </Button>
          </Popconfirm>
        );
      },
    },
  ];


  const deleteImage = async (image: any) => {
    if (!image) return message.error('Provide a link');

    const findImage = images.find((i: any) => i.link === image.link);

    if (!findImage) return message.error('Invalid image');

    try {
      await Axios.delete(`http://localhost:3001/files/${findImage.filename}`, {
        withCredentials: true,
      });

      setState((state) => ({
        ...state,
        images: images.filter((x: any) => x.filename !== findImage.filename),
      }));

      message.success('Deleted file successfully');
    } catch (err) {
      message.error(err.response.data.error);
    }
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>Astral Dashboard</title>
      </Head>

      <Navbar user={user} enabled="home" />

      <div className={styles.dashboard}>
        <div className={styles.section}>
          <h1 className={styles.title}>Welcome, {user.username}.</h1>
          <div className={styles.statsContainer} style={{
            marginTop: '-5px',
          }}>
            <div className={styles.statsBox}>
              <h1 className={styles.statsTitle}>
                <CameraOutlined className={styles.statsIcon} /> Images
              </h1>
              <span>
                You have uploaded <strong>{user.uploads}</strong> images.
              </span>
            </div>
            <div className={styles.statsBox}>
              <h1 className={styles.statsTitle}>
                <MailOutlined className={styles.statsIcon} /> Invites
              </h1>
              <span>
                <Button onClick={manageInvites}>
                  Manage Invites <strong> ({user.invites})</strong>
                </Button>
              </span>
            </div>
            <div className={styles.statsBox}>
              <h1 className={styles.statsTitle}>
                <KeyOutlined className={styles.statsIcon} /> Key
              </h1>
              <span style={{ marginTop: '-8px' }}>
                Your upload key is <Spoiler text={user.key} />
              </span>
            </div>
          </div>
        </div>
        <div className={styles.section} style={{ marginTop: '20px', marginBottom: '20px', paddingBottom: '20px' }}>
          <h1 className={styles.title}>Gallery</h1>
          <p className={styles.galleryCaption}>Here you can view all of your images.</p>
          <div className={styles.galleryContainer}>
            {
              images.length <= 0 ? (
                <p
                  style={{
                    fontSize: '15px',
                    marginLeft: '38px',
                    marginTop: '-8px',
                    paddingBottom: '5px',
                  }}
                >
                  You do not have any images.
                </p>
              ) : (
                <List
                  dataSource={images.filter((i) => i.filename.split('.')[1] !== 'mp4')}
                  pagination={images.length <= 14 ? false : {
                    pageSize: 14,
                    showSizeChanger: false,
                    responsive: true,
                    style: {
                      marginLeft: '-20px',
                    },
                  }}
                  renderItem={(m: any) => {
                    return (
                      <Card
                        key={m.link}
                        style={{
                          width: '239px',
                          height: '170px',
                          marginBottom: '10px',
                          marginLeft: '10px',
                        }}
                        cover={
                          <a href={m.link} target="blank">
                            <img
                              style={{
                                height: '100px',
                                width: '239px',
                                objectFit: 'cover',
                              }}
                              src={m.link}
                            />
                          </a>
                        }
                      >
                        <div style={{
                          flexDirection: 'row',
                          display: 'flex',
                        }}>
                          <p>Uploaded on {m.dateUploaded}</p>
                          <Button type="primary" onClick={() => deleteImage(m)} style={{
                            backgroundColor: '#e03024',
                            border: 'none',
                            marginLeft: '13px',
                            marginTop: '-1.5px',
                          }} shape="circle" icon={<DeleteOutlined />} size="small" />
                        </div>
                      </Card>
                    );
                  }}
                >

                </List>
              )
            }
          </div>
        </div>
      </div>

      <Modal
        title="Invite Manager"
        visible={showInviteManager}
        onCancel={hideInviteManager}
        footer={null}
      >
        <Table
          rowKey="code"
          pagination={false}
          locale={{ emptyText: 'You haven\'t made any invites.' }}
          dataSource={user.createdInvites.filter((i: any) => i.useable !== false)}
          columns={columns}
        />
        <Button style={{ marginTop: '23px' }} onClick={createInvite}>
          Create invite <strong> ({user.invites})</strong>
        </Button>
      </Modal>
    </div>
  );
}


// images.map((m: any) => {
//   return (
//     <Card
//       key={m.link}
//       style={{
//         width: '236px',
//         height: '170px',
//         marginBottom: '10px',
//         marginLeft: '10px',
//       }}
//       cover={
//         <a href={m.link} target="blank">
//           <img
//             style={{
//               height: '100px',
//               width: '236px',
//               objectFit: 'cover',
//             }}
//             src={m.link}
//           />
//         </a>
//       }
//     >
//       <div style={{
//         flexDirection: 'row',
//         display: 'flex',
//       }}>
//         <p>Uploaded on {m.dateUploaded}</p>
//         <Button type="primary" onClick={() => deleteImage(m)} style={{
//           backgroundColor: '#e03024',
//           border: 'none',
//           marginLeft: '13px',
//           marginTop: '-1.5px',
//         }} shape="circle" icon={<DeleteOutlined />} size="small" />
//       </div>
//     </Card>
//   );
// });
