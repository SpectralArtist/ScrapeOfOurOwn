import { useState, useEffect  } from 'react';
import { WebscraperProps} from './Webscraper.types';
import WebscraperDataService from './Webscraper.service';
import ScrapeSetDataService from '../ScrapeSet/ScrapeSet.service';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Title from 'antd/lib/typography/Title';

function WebscraperComponent() {
    const [webscrapers, setWebscrapers] = useState([]);

    const WebscraperColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link'
        },
        {
            title: 'Public',
            dataIndex: 'public',
            key: 'public',
            render: (val: boolean) => {
                if (val) {
                    return <CheckOutlined style={{ color: "green" }}/>
                } else {
                    return <CloseOutlined style={{ color: "red" }}/>
                } 
            }
        },
        {
            title: 'Delete',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => {
                return <DeleteOutlined onClick={() => deleteWebscraper(name)}/>
            }
        },
        {
            title: 'Scrape',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => {
                return <DeleteOutlined onClick={() => forceScrape(name)}/>
            }
        }
    ];

    useEffect(() => {
        updateWebscrapers();
    }, []);

    function updateWebscrapers() {
        WebscraperDataService.getAll()
        .then(data => {
            console.log(data.data);
            setWebscrapers(data.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    function createWebscraper(webscraper: WebscraperProps) {
        console.log(webscraper);
        WebscraperDataService.create(webscraper)
        .then(data => {
            updateWebscrapers();
        })
        .catch(err => {
            console.log(err);
        });
    }

    function deleteWebscraper(id: string) {
        WebscraperDataService.delete(id)
        .then(data => {
            updateWebscrapers();
        })
        .catch(err => {
            console.log(err);
        });
    }

    function forceScrape(name: string) {
        ScrapeSetDataService.forceScrape(name)
        .then(data => {
            
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <div>
            <Form
                name="webscraper"
                onFinish={createWebscraper}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 6 }}
            >            
                <Form.Item
                    style={{margin: 0, padding: 0}}
                    wrapperCol={{ offset: 2 }}
                >
                    <Title level={3}>Create Webscraper</Title>
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Link"
                    name="link"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="public"
                    valuePropName="checked"
                    wrapperCol={{ offset: 2 }}
                >
                    <Checkbox>Public</Checkbox>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 2 }}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
            <Row justify="center">
                <Col span={22}>
                    <Table
                        rowKey="name"
                        dataSource={webscrapers}
                        columns={WebscraperColumns}>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}

export default WebscraperComponent;