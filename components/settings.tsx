import { DeleteOutlined, DownloadOutlined, PlusOutlined, SaveOutlined, ToolOutlined } from '@ant-design/icons';
import { Button, Collapse, Input, message, Modal, Select, Switch, Tooltip } from 'antd';
import Axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/settings.module.css';
import Navbar from './navbar';
const { Option } = Select;
const { Panel } = Collapse;
import { ChromePicker } from 'react-color';

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
      name: 'astral.cool',
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
    showColorPicker,
  }, setState] = useState<InitialState>(initialState);

  const domainSelect = (
    <Select
      onSelect={(x) => {
        const domain = domains.find((d) => d.name === x);

        if (!domain) return message.error('Invalid domain selection');

        setState((state) => ({ ...state, selectedDomain: domain, domainInput: domain.wildcard ? '' : domainInput }));
      }}
      defaultValue={selectedDomain.name}
      className="select-after"
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
      defaultValue="astral.cool"
      className="select-after"
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
        title: embed.title || 'default',
        description: embed.description || 'default',
        color: embed.color || '#4287f5',
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
        onCancel={() => setState((state) => ({ ...state, embedEditor: false, showColorPicker: false }))}
        footer={null}
      >
        <Input
          onChange={(val) => setState((state) => ({ ...state, embed: { ...embed, title: val.target.value } }))}
          value={embed.title !== '' && embed.title !== null && embed.title !== 'default' ? embed.title : ''}
          className={styles.embedInput}
          placeholder="Embed Title"
        />

        <Input
          onChange={(val) => setState((state) => ({ ...state, embed: { ...embed, description: val.target.value } }))}
          value={embed.description !== '' && embed.description !== null && embed.description !== 'default' ? embed.description : ''}
          className={styles.embedInput}
          placeholder="Embed Description"
        />

        <Button
          block
          onClick={() => setState((state) => ({ ...state, showColorPicker: !showColorPicker }))}
          style={{
            marginBottom: '8px',
            backgroundColor: embed.color,
            border: 'none',
          }}
        >
            Embed Color
        </Button>

        {showColorPicker && <ChromePicker
          disableAlpha
          color={embed.color}
          className={styles.colorPicker}
          onChange={(color) => setState((state) => ({ ...state, embed: { ...embed, color: color.hex } }))}
        />}

        <Button
          className={styles.configButton}
          style={{
            marginBottom: '-5px',
            marginTop: '7px',
          }}
          icon={<SaveOutlined />}
          onClick={updateEmbed}
        >
            Save Settings
        </Button>
      </Modal>
    </div>
  );
}
