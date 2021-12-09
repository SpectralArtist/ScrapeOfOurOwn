import { useState, useEffect  } from 'react';
import { SearchProps, AuthorColumns } from './Author.types';
import AuthorDataService from './Author.service';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Title from 'antd/lib/typography/Title';

function AuthorComponent() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        AuthorDataService.getAll()
        .then(data => {
            setAuthors(data.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    function updateAuthors(search: SearchProps) {
        const searchPhrase = search.search ? search.search : '';

        AuthorDataService.getAuthorWithWord(searchPhrase)
        .then(data => {
            setAuthors(data.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <div>
            <Form
                name="search"
                onFinish={updateAuthors}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 6 }}
            >            
                <Form.Item
                    style={{margin: 0, padding: 0}}
                    wrapperCol={{ offset: 2 }}
                >
                    <Title level={3}>Filter Authors By Name</Title>
                </Form.Item>
                <Form.Item
                    label="Search"
                    name="search"
                >
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 2 }}>
                    <Button type="primary" htmlType="submit">Get Authors</Button>
                </Form.Item>
            </Form>
            <Row justify="center">
                <Col span={22}>
                    <Table
                        rowKey="id"
                        dataSource={authors}
                        columns={AuthorColumns}>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}

export default AuthorComponent;