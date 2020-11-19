import { DeleteOutlined, DownloadOutlined, PlusOutlined, SaveOutlined, ToolOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Checkbox, Collapse, Input, message, Modal, Select, Switch, Tooltip } from 'antd';
import Axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/settings.module.css';
import Navbar from './navbar';
const { Option } = Select;
const { Panel } = Collapse;

export default function Settings({ userProp, domainsProp, router }) {
  interface InitialState {
    user: any;
    domains: Array<any>;
    selectedDomain: any;
    domainInput: string;
    randomDomainInput: string;
    selectedRandomDomain: any;
    showLink: boolean;
    invisibleLink: boolean;
    randomDomain: boolean;
    embed: {
      enabled: boolean;
      title: string;
      description: string;
      color: string;
      author: boolean;
      randomColor: boolean;
    };
    embedEditor: boolean;
    showColorPicker: boolean;
  }

  const initialState = {
    user: userProp,
    selectedDomain: {
      name: userProp.settings.domain.name,
      wildcard: domainsProp.find((d) => d.name === userProp.settings.domain.name) ? domainsProp.find((d) => d.name === userProp.settings.domain.name).wildcard : false,
    },
    domainInput: userProp.settings.domain.subdomain !== '' &&
    userProp.settings.domain.subdomain !== null ?
      userProp.settings.domain.subdomain :
      '',
    domains: domainsProp,
    randomDomainInput: '',
    selectedRandomDomain: {
      name: 'i.astral.cool',
      wildcard: false,
    },
    showLink: userProp.settings.showLink,
    invisibleLink: userProp.settings.invisibleUrl,
    randomDomain: userProp.settings.randomDomain.enabled,
    embed: userProp.settings.embed,
    embedEditor: false,
    showColorPicker: false,
  };

  const [{
    user,
    domains,
    selectedDomain,
    domainInput,
    randomDomainInput,
    selectedRandomDomain,
    showLink,
    invisibleLink,
    randomDomain,
    embed,
    embedEditor,
  }, setState] = useState<InitialState>(initialState);

  const domainSelect = (
    <Select
      onSelect={(x) => {
        const domain = domains.find((d) => d.name === x);

        if (!domain) return message.error('Invalid domain selection');

        setState((state) => ({ ...state, selectedDomain: domain, domainInput: domain.wildcard ? '' : domainInput }));
      }}
      defaultValue={selectedDomain.name}
      className={styles.domainDropdown}
    >
      {domains.map((d) => (
        <Option key={d.name} value={d.name}>
          {d.name}
        </Option>
      ))}
    </Select>
  );

  const randomDomainSelect = (
    <Select
      onSelect={(x) => {
        const domain = domains.find((d) => d.name === x);

        if (!domain) return message.error('Invalid domain selection');

        setState((state) => ({ ...state, selectedRandomDomain: domain, randomDomainInput: domain.wildcard ? '' : randomDomainInput }));
      }}
      defaultValue="i.astral.cool"
      className={styles.domainDropdown}
    >
      {domains.map((d) => (
        <Option key={d.name} value={d.name}>
          {d.name}
        </Option>
      ))}
    </Select>
  );

  const setDomain = (val: string) => {
    val = val.replace(/\s/g, '-');

    if (val.trim().length > 60) return;

    setState((state) => ({ ...state, domainInput: val }));
  };

  const setRandomDomain = (val: string) => {
    val = val.replace(/\s/g, '-');

    if (val.trim().length > 60) return;

    setState((state) => ({ ...state, randomDomainInput: val }));
  };

  const updateDomain = async () => {
    try {
      const domain = domains.find((d) => d.name === selectedDomain.name);

      if (!domain) return message.error('Invalid domain');

      const type: string = domain.wildcard && domainInput !== '' && domainInput !== null ? 'wildcard': 'normal';

      const reqData = {
        type,
        domain,
        subdomain: domainInput,
      };

      const { data } = await Axios.put(`${process.env.BACKEND_URL}/users/@me/domain`, reqData, {
        withCredentials: true,
      });

      if (data.success) message.success('Updated domain successfully');
    } catch (err) {
      message.error(err.response.data.error);
    }
  };

  const addRandomDomain = async () => {
    try {
      const domain = domains.find((d) => d.name === selectedDomain.name);

      if (!domain) return message.error('Invalid domain');

      const reqData = {
        domain: selectedRandomDomain.wildcard && randomDomainInput !== '' && randomDomainInput !== null ? `${randomDomainInput}.${selectedRandomDomain.name}` : selectedRandomDomain.name,
      };

      if (user.settings.randomDomain.domains.find((d) => d === reqData.domain)) return message.error('This domain is already being used');

      const { data } = await Axios.put(`${process.env.BACKEND_URL}/users/@me/randomDomain`, reqData, {
        withCredentials: true,
      });

      if (data.success) {
        const newArray = [reqData.domain];

        setState((state) => ({
          ...state,
          user: {
            ...user,
            settings: {
              ...user.settings,
              randomDomain: {
                ...user.settings.randomDomain,
                domains: user.settings.randomDomain.domains.concat(newArray),
              },
            },
          },
        }));

        message.success('Added domain successfully');
      }
    } catch (err) {
      message.error(err.response.data.error);
    }
  };

  const deleteRandomDomain = async (domain: string) => {
    try {
      const findDomain = user.settings.randomDomain.domains.find((d) => d === domain);

      if (!findDomain) return message.error('Invalid domain');

      const { data } = await Axios.delete(`${process.env.BACKEND_URL}/users/@me/randomDomain`, {
        withCredentials: true,
        data: {
          domain,
        },
      });

      if (data.success) {
        setState((state) => ({
          ...state,
          user: {
            ...user,
            settings: {
              ...user.settings,
              randomDomain: {
                ...user.settings.randomDomain,
                domains: user.settings.randomDomain.domains.filter((d) => d !== domain),
              },
            },
          },
        }));

        message.success('Deleted domain successfully');
      }
    } catch (err) {
      message.error(err.response.data.error);
    }
  };

  const enable = async (property: string, val: boolean) => {
    const options = ['showLink', 'invisibleUrl', 'randomDomain', 'embed'];

    try {
      const reqData: any= {};

      for (const prop of options) {
        if (prop === property) reqData[property] = val;
      }

      const { data } = await Axios.put(`${process.env.BACKEND_URL}/users/@me/settings`, reqData, {
        withCredentials: true,
      });

      if (data.success) {
        if (property === 'embed') {
          setState((state) => ({ ...state, embed: { ...embed, enabled: val } }));
        } else {
          setState((state) => ({ ...state, reqData }));
        }
        message.success(val ? `Enabled ${property} successfully` : `Disabled ${property} successfully`);
      }
    } catch (err) {
      message.error(err.response.data.error);
    }
  };

  const updateEmbed = async () => {
    try {
      const reqData = {
        title: embed.title,
        description: embed.description,
        color: embed.color || '#4287f5',
        author: embed.author,
        randomColor: embed.randomColor,
      };

      const { data } = await Axios.put(`${process.env.BACKEND_URL}/users/@me/embed`, reqData, {
        withCredentials: true,
      });

      if (data.success) {
        message.success('Updated embed successfully');
      }
    } catch (err) {
      message.error(err.response.data.error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Astral Dashboard</title>
      </Head>

      <Navbar user={user} enabled="settings" />

      <div className={styles.settingsPage}>
        <div className={styles.section}>
          <h1 className={styles.title}>Config Generator</h1>
          <p className={styles.titleCaption}>You only need to generate one config.</p>

          <Button
            href={`${process.env.BACKEND_URL}/files/config?key=${user.key}`}
            className={styles.configButton}
            icon={<DownloadOutlined style={{ paddingTop: '3px' }} />}
          >
            <span style={{ paddingTop: '2px' }}>
              Download Config
            </span>
          </Button>
        </div>

        <div className={styles.section}>
          <h1 className={styles.title}>Domain Preferences</h1>
          <p className={styles.titleCaption}>
            Your current domain is<span style={{ fontWeight: 500 }}>{' '}
              {domainInput !== '' && selectedDomain.wildcard ? domainInput + '.' + selectedDomain.name : selectedDomain.name}
            </span>.
          </p>

          <Input
            value={domainInput !== '' && selectedDomain.wildcard ? domainInput : ''}
            onChange={(val) => setDomain(val.target.value)}
            disabled={selectedDomain.wildcard === false}
            className={styles.domainInput}
            placeholder={selectedDomain.wildcard ? 'subdomain' : 'not available'}
            addonAfter={domainSelect}
          />

          <Button
            className={styles.configButton}
            icon={<SaveOutlined />}
            onClick={updateDomain}
          >
            Save Domain
          </Button>

          <div>
            <Collapse style={{
              maxWidth: '600px',
              marginTop: '0px',
              marginBottom: '25px',
            }}>
              <Panel header="Random Domain" key="1">
                <h1 className={styles.title} style={{
                  marginTop: '-5px',
                }}>Random Domain</h1>
                <p className={styles.titleCaption} style={{
                  marginTop: '-25px',
                }}>
                  Your random domains selections are: <span style={{ fontWeight: 500 }}>
                    {user.settings.randomDomain.domains.length <= 0 ? 'none.' : (
                      user.settings.randomDomain.domains.map((m) => <div className={styles.randomDomainContainer} key={m}>
                        <p style={{
                          marginBottom: '-2px',
                          marginTop: '2px',
                        }}>{m}</p>
                        <Button type="primary" onClick={() => deleteRandomDomain(m)} style={{
                          backgroundColor: '#e03024',
                          border: 'none',
                          marginLeft: '8px',
                          marginTop: '1px',
                        }} shape="circle" icon={<DeleteOutlined />} size="small" />
                      </div>)
                    )}
                  </span>
                </p>

                <Input
                  value={randomDomainInput !== '' ? randomDomainInput : ''}
                  onChange={(val) => setRandomDomain(val.target.value)}
                  disabled={selectedRandomDomain.wildcard === false}
                  style={{
                    marginBottom: '20px',
                  }}
                  placeholder={selectedRandomDomain.wildcard ? 'subdomain' : 'not available'}
                  addonAfter={randomDomainSelect}
                />

                <Button
                  className={styles.configButton}
                  style={{
                    marginBottom: '4px',
                  }}
                  icon={<PlusOutlined />}
                  onClick={addRandomDomain}
                >
                  Add Domain
                </Button>
              </Panel>
            </Collapse>
          </div>
        </div>

        <div className={styles.section} style={{
          marginBottom: '40px',
        }}>
          <h1 className={styles.title}>Upload Preferences</h1>

          <div className={styles.switchContainer}>
            <div className={styles.switchInput}>
              {embed.enabled && <Button
                type="primary"
                onClick={() => setState((state) => ({ ...state, embedEditor: true }))}
                style={{
                  backgroundColor: '#444444',
                  border: 'none',
                  marginRight: '10px',
                  marginTop: '-1px',
                }} shape="circle" icon={<ToolOutlined />} size="small" />}

              <Tooltip placement="topRight" title="Embeds will allow you to have a custom title, description, and color on your images.">
                <p style={{ cursor: 'pointer' }}>Embeds</p>
              </Tooltip>

              <Switch
                defaultChecked={embed.enabled}
                onClick={(val) => enable('embed', val)}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>

            <div className={styles.switchInput}>
              <Tooltip placement="topRight" title="Show link will make your url show up in discord.">
                <p style={{ cursor: 'pointer' }}>Show Link</p>
              </Tooltip>

              <Switch
                defaultChecked={showLink}
                onClick={(val) => enable('showLink', val)}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>

            <div className={styles.switchInput}>
              <Tooltip placement="topRight" title="Invisible link will get rid of the filename at the end of the link of the image.">
                <p style={{ cursor: 'pointer' }}>Invisible Link</p>
              </Tooltip>

              <Switch
                defaultChecked={invisibleLink}
                onClick={(val) => enable('invisibleUrl', val)}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>

            <div className={styles.switchInput} style={{
              marginBottom: '5px',
            }}>
              <Tooltip placement="topRight" title="Random domain will choose a random domain which you can provide.">
                <p style={{ cursor: 'pointer' }}>Random Domain</p>
              </Tooltip>

              <Switch
                defaultChecked={randomDomain}
                onClick={(val) => enable('randomDomain', val)}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Embed Editor"
        visible={embedEditor}
        onCancel={() => setState((state) => ({ ...state, embedEditor: false }))}
        footer={null}
      >
        <Checkbox
          defaultChecked={embed.randomColor}
          onChange={(val) => setState((state) => ({ ...state, embed: { ...embed, randomColor: val.target.checked } }))}
          style={{
            marginBottom: '10px',
          }}>
          Random Embed Color
        </Checkbox>

        <br/>

        <Checkbox
          defaultChecked={embed.author}
          onChange={(val) => setState((state) => ({ ...state, embed: { ...embed, author: val.target.checked } }))}
          style={{
            marginBottom: '13px',
          }}>
          Show Embed Author
        </Checkbox>

        <AutoComplete
          style={{ width: '100%', marginBottom: '10px' }}
          options={[{ value: '{username}' }, { value: '{file}' }, { value: '{date}' }]}
          onChange={(val) =>
            setState((state) => ({ ...state, embed: { ...embed, title: val } }))
          }
          value={
            embed.title !== '' && embed.title !== null && embed.title !== 'default' ?
              embed.title :
              ''
          }
          filterOption={(input, option) => {
            return (
              input.split(' ').splice(-1)[0].startsWith('{') &&
              option.value.startsWith(input.split(' ').splice(-1)) &&
              !input.endsWith('}')
            );
          }}
          onSelect={(_input, option) => {
            setState((state) => ({
              ...state,
              embed: {
                ...embed,
                title: `${embed.title === 'default' ? '' : embed.title}${embed.title.length > 0 && embed.title !== 'default' ?
                  option.value.split(embed.title.split(' ').splice(-1))[1] :
                  option.value
                }`,
              },
            }));
          }}
          placeholder="Embed Title"
        />

        <AutoComplete
          style={{ width: '100%', marginBottom: '10px' }}
          options={[{ value: '{username}' }, { value: '{file}' }, { value: '{date}' }]}
          onChange={(val) =>
            setState((state) => ({ ...state, embed: { ...embed, description: val } }))
          }
          value={
            embed.description !== '' && embed.description !== null && embed.description !== 'default' ?
              embed.description :
              ''
          }
          filterOption={(input, option) => {
            return (
              input.split(' ').splice(-1)[0].startsWith('{') &&
              option.value.startsWith(input.split(' ').splice(-1)) &&
              !input.endsWith('}')
            );
          }}
          onSelect={(_input, option) => {
            setState((state) => ({
              ...state,
              embed: {
                ...embed,
                description: `${embed.description === 'default' ? '' : embed.description}${embed.description.length > 0 && embed.description !== 'default' ?
                  option.value.split(embed.description.split(' ').splice(-1))[1] :
                  option.value
                }`,
              },
            }));
          }}
          placeholder="Embed Description"
        />

        {!embed.randomColor && (
          <input
            type="color"
            value={embed.color}
            onChange={(val) =>
              setState((state) => ({
                ...state,
                embed: { ...embed, color: val.target.value },
              }))
            }
            className={styles.colorPicker}
          />
        )}

        <div
          className={styles.embedPreview}
          style={embed.description === '' || embed.title === '' ? {
            borderLeft: `5px solid ${embed.color}`,
            minHeight: (embed.description === '' && embed.title === '' && !embed.author) ? '220px' : '260px',
          }: { borderLeft: `5px solid ${embed.color}` }}
        >
          {embed.author && <span className={styles.embedAuthor}>{user.username}</span>}
          {embed.title !== '' && (
            <span
              style={
                !embed.author ?
                  {
                    marginTop: '20px',
                  } :
                  null
              }
              className={styles.embedTitle}
            >
              {embed.title !== 'default' ? embed.title
                .replace('{date}', new Date().toLocaleString())
                .replace('{username}', user.username)
                .replace('{file}', '6840763424.png') :
                '6840763424.png'
              }
            </span>
          )}
          {embed.description !== '' && (
            <span className={styles.embedDescription} style={!embed.author && !embed.title ? { marginTop: '20px' } : null}>
              {embed.description !== 'default' ? embed.description
                .replace('{date}', new Date().toLocaleString())
                .replace('{username}', user.username)
                .replace('{file}', '6840763424.png') :
                `Uploaded on ${new Date().toLocaleString()} by ${user.username}.`
              }
            </span>
          )}
          <img src="https://cdn.astral.cool/dcd57176-c091-48a0-ad13-c50d7d8eae44/5edf5ffd89.png" className={styles.embedImage} />
        </div>


        <Button
          className={styles.configButton}
          style={{
            marginBottom: '-5px',
            marginTop: '7px',
          }}
          icon={<SaveOutlined />}
          onClick={updateEmbed}
        >
          Save Embed
        </Button>
      </Modal>
    </div>
  );
}
