import { useState, useEffect  } from 'react';
// import { StoryProps } from './Analysis.types';
import StoryDataService from '../../Story/Story.service';
import { ScatterProps } from './Bubble.types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Title from 'antd/lib/typography/Title';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import { STORY_STR_REF } from '../../App.types';
import { Scatter } from '@ant-design/charts';
import { StoryScatterModel } from './Bubble.types';

import {
    CloseOutlined,
    CheckOutlined
} from '@ant-design/icons';

const { Option } = Select;



function BubbleComponent() {
    const [stories, setStories] = useState<StoryScatterModel[]>([]);
    const [xaxis, setXaxis] = useState<string>(STORY_STR_REF.CHAPTERS);
    const [yaxis, setYaxis] = useState<string>(STORY_STR_REF.VIEWS);

    const config = {
        data: stories,
        height: 400,
        xField: xaxis,
        yField: yaxis,
        sizeField: 'numSame',
        size: [2, 10] as [number, number],
        colorField: 'complete',
        shape: 'circle',
        brush: {
            enabled: true,
                mask: {
                    style: {
                    fill: 'rgba(255,0,0,0.15)',
                },
            },
        },
        tooltip: {
            showTitle: true,
            title: 'Story',
            fields: [xaxis, yaxis, 'numSame']
        },
        color: (type: any) => {
            console.log(type);
            if (type.complete == "Complete") {
                return 'green';
            }
            return 'red';
        },
        pointStyle: (vals: Record<string, number | string>) => {
            console.log(vals);
            if (vals.complete === 'Complete') {
              return {
                fill: 'green',
                stroke: 'green',
                opacity: 0.6,
              }
            }
            return {
              fill: 'red',
              stroke: 'red',
              opacity: 0.6,
            }
        }
    };

    console.log(config.data);

    const StoryColumns = [
        {
          title: xaxis.charAt(0).toUpperCase() + xaxis.substring(1),
          dataIndex: xaxis,
          key: xaxis
        },
        {
            title: yaxis.charAt(0).toUpperCase() + yaxis.substring(1),
            dataIndex: yaxis,
            key: yaxis
        },
        {
            title: "Number of Stories",
            dataIndex: "numSame",
            key: "numSame"
        },
        {
            title: 'Completed Story',
            dataIndex: 'complete',
            key: 'complete',
            render: (complete: string) => {
                return (complete == "Complete" ? <CheckOutlined style={{ color: "green" }} /> 
                                 : <CloseOutlined style={{ color: "red" }} /> )
            }
        }
    ]

    useEffect(() => {
        updateStories();
    }, []);

    function updateStories(x?: string, y?: string) {
        if (!x) {
            x = xaxis;
        } 
        if (!y) {
            y = yaxis;
        }

        StoryDataService.getCompletedStats(xaxis, yaxis)
        .then(data => {
            data.data.forEach((story: StoryScatterModel) => {
                if (story.complete) {
                    story.complete = "Complete"
                } else {
                    story.complete = "In Progress"
                }
            });
            setStories(data.data);
            console.log(data.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    function getSets(stats: ScatterProps) {
        setXaxis(stats.xaxis);
        setYaxis(stats.yaxis);
        updateStories(stats.xaxis, stats.yaxis);
    }

    return (
        <div>
            <Form
                name="webscraper"
                onFinish={getSets}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 6 }}
                initialValues={{
                    "xaxis": STORY_STR_REF.CHAPTERS,
                    "yaxis": STORY_STR_REF.VIEWS
                }}
            >            
                <Form.Item
                    style={{margin: 0, padding: 0}}
                    wrapperCol={{ offset: 2 }}
                >
                    <Title level={3}>Select Information Set</Title>
                </Form.Item>
                <Form.Item
                    label="X-Axis"
                    name="xaxis"
                    rules={[{ required: true }]}
                >
                    <Select defaultValue={STORY_STR_REF.CHAPTERS}>
                        <Option value={STORY_STR_REF.CHAPTERS}>Chapters</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Y-Axis"
                    name="yaxis"
                    rules={[{ required: true }]}
                >
                    <Select defaultValue={STORY_STR_REF.VIEWS}>
                        <Option value={STORY_STR_REF.VIEWS}>Views</Option>
                        <Option value={STORY_STR_REF.LIKES}>Likes</Option>
                        <Option value={STORY_STR_REF.COMMENTS}>Comments</Option>
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 2 }}>
                    <Button type="primary" htmlType="submit">Get Data</Button>
                </Form.Item>
            </Form>
            <Title level={3}>Story Bubble Graph Display</Title>
            <Scatter {...config} />
            <Row justify="center">
                <Col span={22}>
                    <Table
                        rowKey="id"
                        dataSource={stories}
                        columns={StoryColumns}>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col push={1}>
                    <Button type="primary" onClick={() => updateStories()} >Update Stories</Button>
                </Col>
            </Row>
        </div>
    )
}

export default BubbleComponent;