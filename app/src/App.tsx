import './App.css';

import { useState } from 'react';
import HomeComponent from './Home/Home';
import AuthorComponent from './Author/Author';
import WebscraperComponent from './Webscraper/Webscraper';
import StoryComponent from './Story/Story';
import TagComponent from './Tag/Tag';
import BubbleComponent from './Analysis/Bubble/Bubble';
import ScatterComponent from './Analysis/Scatter/Scatter';
import DashboardComponent from './Dashboard/Dashboard';
import Title from 'antd/lib/typography/Title';
import { Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DatabaseOutlined,
  CoffeeOutlined,
  FileTextOutlined,
  DotChartOutlined,
  BranchesOutlined,
  HomeOutlined,
  TagsOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const { SubMenu } = Menu;

function App() {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible
                collapsed={collapsed} 
                onCollapse={() => setCollapsed(!collapsed)}
            >
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<AppstoreOutlined />}>
                        <Link to="/Dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<DatabaseOutlined />}>
                        <Link to="/Webscrapers">Webscrapers</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<CoffeeOutlined />}>
                        <Link to="/Authors">Authors</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<FileTextOutlined />}>
                        <Link to="/Stories">Stories</Link>
                    </Menu.Item>
                    <Menu.Item key="6" icon={<TagsOutlined />}>
                        <Link to="/Tags">Tags</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<BranchesOutlined />} title="Analysis">
                        <Menu.Item key="7" icon={<DotChartOutlined />}>
                            <Link to="/Analysis/Bubble">Bubble Plot</Link>
                        </Menu.Item>
                        <Menu.Item key="8" icon={<DotChartOutlined />}>
                            <Link to="/Analysis/Scatter">Scatter Plot</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout 
                className="site-layout" 
            >
                <Header className="site-layout-background" style={{ padding: 0, marginBottom: 10 }}>
                    <Title level={1} style={{marginLeft: 10, marginTop: 6, color: "#00AAEE"}}>Scrape Of Our Own</Title>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Routes>
                        <Route path="/" element={<HomeComponent />}/>
                        <Route path="/Dashboard" element={<DashboardComponent />}/>
                        <Route path="/Webscrapers" element={<WebscraperComponent />} />
                        <Route path="/Authors" element={<AuthorComponent />} />
                        <Route path="/Stories" element={<StoryComponent />} />
                        <Route path="/Tags" element={<TagComponent />} />
                        <Route path="/Analysis/Bubble" element={<BubbleComponent />} />
                        <Route path="/Analysis/Scatter" element={<ScatterComponent />} />
                    </Routes>
                </Content>
                <Footer style={{ textAlign: 'center' }}>ScrapeOfOurOwn ©2021 Created by Spectral Artist</Footer>
            </Layout>
        </Layout>
    );
}

export default App;
