import { DeleteOutlined, DownloadOutlined, PlusOutlined, QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Collapse, Input, List, message, Select, Switch, Tooltip } from 'antd';
import Axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
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
  }

  const initialState = {
    user: userProp,
    selectedDomain: {
      name: '',
      wildcard: false,
    },
    domainInput: '',
    domains: domainsProp,
    randomDomainInput: '',
    selectedRandomDomain: {
      name: 'astral.cool',
      wildcard: false,
    },
  };

  const [{ user, domains, selectedDomain, domainInput, randomDomainInput, selectedRandomDomain }, setState] = useState<InitialState>(initialState);

  useEffect(() => {
    let name: string;
    let wildcard: boolean;
    const domain = domains.find((d) => d.name === user.settings.domain.name);

    if (!domain) {
      name = 'astral.cool';
      wildcard = false;
    }

    name = domain.name;
    wildcard = domain.wildcard;

    setState((state) => ({
      ...state,
      selectedDomain: { name, wildcard },
      domainInput:
        user.settings.domain.subdomain !== '' &&
        user.settings.domain.subdomain !== null ?
          user.settings.domain.subdomain :
          '',
    }));
  }, []);

  const domainSelect = (
    <Select
      onSelect={(x) => {
        const domain = domains.find((d) => d.name === x);

        if (!domain) return message.error('Invalid domain selection');

        setState((state) => ({ ...state, selectedDomain: domain, domainInput: domain.wildcard ? '' : domainInput }));
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

      const { data } = await Axios.put('http://localhost:3001/users/@me/domain', reqData, {
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

      const { data } = await Axios.put('http://localhost:3001/users/@me/randomDomain', reqData, {
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

      const { data } = await Axios.delete('http://localhost:3001/users/@me/randomDomain', {
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
            href={`http://localhost:3001/files/config?key=${user.key}`}
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
              <p>Show Link</p>
              <Switch
                onClick={(val) => {
                  setState((state) => ({ ...state, randomDomain: val }));
                }}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>

            <div className={styles.switchInput}>
              <p>Invisible Link</p>
              <Switch
                onClick={(val) => {
                  setState((state) => ({ ...state, randomDomain: val }));
                }}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>

            <div className={styles.switchInput} style={{
              marginBottom: '5px',
            }}>
              <Tooltip placement="right" overlayStyle={{
                marginTop: '-10px',
              }} title="Random domain will choose a random domain which you can provide.">
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>

              <p>Random Domain</p>
              <Switch
                onClick={(val) => {
                  setState((state) => ({ ...state, randomDomain: val }));
                }}
                style={{
                  marginLeft: '10px',
                  width: '55px',
                }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
