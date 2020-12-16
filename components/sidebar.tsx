import React from 'react';
import { Layout } from 'antd';

export default function Sidebar({ menu }) {
    return (
        <Layout.Sider
            className="sidebar"
            breakpoint={'lg'}
            collapsedWidth={0}
            trigger={null}
        >
            {menu}
        </Layout.Sider>
    );
}
