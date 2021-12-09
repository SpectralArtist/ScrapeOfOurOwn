import { useState, useEffect  } from 'react';
import { StoryProps, SearchProps } from './Story.types';
import StoryDataService from './Story.service';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Title from 'antd/lib/typography/Title';
import Button from 'antd/lib/button';

import {
    CloseOutlined,
    CheckOutlined
} from '@ant-design/icons';

function StoryComponent() {
    const [stories, setStories] = useState([]);

    const StoryColumns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: 'Chapters',
          dataIndex: 'chapters',
          key: 'chapters'
        },
        {
          title: 'Word Count',
          dataIndex: 'words',
          key: 'words'
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views'
        },
        {
            title: 'Likes',
            dataIndex: 'likes',
            key: 'likes'
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments'
        },
        {
            title: 'Completed Story',
            dataIndex: 'complete',
            key: 'complete',
            render: (complete: boolean) => {
                return (complete ? <CheckOutlined style={{ color: "green" }} /> 
                                 : <CloseOutlined style={{ color: "red" }} /> )
            }
        }
    ]

    useEffect(() => {
        StoryDataService.getAll()
        .then(data => {
            console.log(data.data);
            setStories(data.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    function updateStories(search: SearchProps) {
        const searchPhrase = search.search ? search.search : '';

        StoryDataService.getStoriesWithWord(searchPhrase)
        .then(data => {
            console.log(data.data);
            setStories(data.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <div>
            <Form
                name="search"
                onFinish={updateStories}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 6 }}
            >            
                <Form.Item
                    style={{margin: 0, padding: 0}}
                    wrapperCol={{ offset: 2 }}
                >
                    <Title level={3}>Filter Stories By Title</Title>
                </Form.Item>
                <Form.Item
                    label="Search"
                    name="search"
                >
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 2 }}>
                    <Button type="primary" htmlType="submit">Get Stories</Button>
                </Form.Item>
            </Form>
            <Row justify="center">
                <Col span={22}>
                    <Title level={2}>Story List</Title>
                    <Table
                        rowKey="id"
                        dataSource={stories}
                        columns={StoryColumns}>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}

export default StoryComponent;