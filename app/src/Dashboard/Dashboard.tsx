import { useState, useEffect  } from 'react';
import StoryDataService from '../Story/Story.service';
import TagDataService from '../Tag/Tag.service';
import { StoryTotalsModel } from '../Story/Story.types';
import { ScatterProps } from './Dashboard.types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Title from 'antd/lib/typography/Title';
import Form from 'antd/lib/form';
import { Pie } from '@ant-design/charts';
import Select from 'antd/lib/select';
import { stringify } from 'querystring';

const { Option } = Select;

function DashboardComponent() {  
    
    const [tagTypeCounts, setTagTypeCounts] = useState([]);
    const [storyTotals, setStoryTotals] = useState<StoryTotalsModel>({
        totalStories: 0,
        totalChapters: 0,
        totalWords: 0,
        totalComments: 0,
        totalViews: 0,
        totalLikes: 0,
        averageStories: 0,
        averageChapters: 0,
        averageWords: 0,
        averageComments: 0,
        averageViews: 0,
        averageLikes: 0
    });

    const pieConfig = {
        data: tagTypeCounts,
        angleField: 'percent',
        colorField: 'type',
        radius: 0.8,
        label: {
          type: 'outer',
          content: '{percentage}',
        },
        interactions: [
          {
            type: 'pie-legend-active',
          },
          {
            type: 'element-active',
          },
        ]
      };

    useEffect(() => {
        getTagTypeCounts();
        getStoryTotals();
    }, []);

    function getTagTypeCounts() {
        TagDataService.getTypeCounts()
        .then(data => {
            setTagTypeCounts(data.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    function getStoryTotals() {
        StoryDataService.getStoryTotals()
        .then(data => {
            const totals: StoryTotalsModel = data.data[0];
            setStoryTotals(totals);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <div>
            <Row gutter={[0, 10]}>
                <Col span={6}>
                    <Card>
                        <Title level={3}>Total Stories</Title>
                        <Title level={5}>{storyTotals.totalStories}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Total Chapters</Title>
                        <Title level={5}>{storyTotals.totalChapters}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Total Words</Title>
                        <Title level={5}>{storyTotals.totalWords}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Total Views</Title>
                        <Title level={5}>{storyTotals.totalViews}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Total Likes</Title>
                        <Title level={5}>{storyTotals.totalLikes}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Total Comments</Title>
                        <Title level={5}>{storyTotals.totalComments}</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Title level={3}>Avg. Chapters Per Story</Title>
                        <Title level={5}>{storyTotals.averageChapters}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Avg. Words Per Story</Title>
                        <Title level={5}>{storyTotals.averageWords}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Avg. Views Per Story</Title>
                        <Title level={5}>{storyTotals.averageViews}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Avg. Likes Per Story</Title>
                        <Title level={5}>{storyTotals.averageLikes}</Title>
                    </Card>
                    <Card>
                        <Title level={3}>Avg. Comments Per Story</Title>
                        <Title level={5}>{storyTotals.averageComments}</Title>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Title level={3}>Percentage Makeup of Tags</Title>
                        <Pie {...pieConfig} />                    
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default DashboardComponent;