import { useState, useEffect  } from 'react';
import StoryDataService from './Tag.service';
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

function TagComponent() {
    const [stories, setStories] = useState([]);

    const TagColumns = [
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
          title: 'Number of Stories',
          dataIndex: 'numStories',
          key: 'numStories'
        }
    ]

    useEffect(() => {
        StoryDataService.getAllCounts()
        .then(data => {
            console.log(data.data);
            setStories(data.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    // function updateStories(search: SearchProps) {
    //     const searchPhrase = search.search ? search.search : '';

    //     StoryDataService.getStoriesWithWord(searchPhrase)
    //     .then(data => {
    //         console.log(data.data);
    //         setStories(data.data);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    // }

    return (
        <div>
            {/* <Form
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
            </Form> */}
            <Row justify="center">
                <Col span={22}>
                    <Title level={2}>Tag List</Title>
                    <Table
                        rowKey="id"
                        dataSource={stories}
                        columns={TagColumns}>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}

export default TagComponent;