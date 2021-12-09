import Title from 'antd/lib/typography/Title';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';

function HomeComponent() {

    return (
        <div>
            <Row>
                <Col span={22}>
                    <Card style={{ borderWidth: 2, borderBlockStyle: "dashed", borderBlockColor: "red"  }}>
                        <p style={{margin: 0}}>
                            <span style={{color: "red"}}><i>Warning: </i></span>
                            This webscraper is designed to work on <a href="https://archiveofourown.org/" target="_blank">Archive of Our Own</a>, a public, self-publishing, <span style={{color: "red"}}>FANFICTION</span> website, and it collects information contained on said website.
                            By that definition, the system cannot control what a user may read amongst the data. This means words and phrases that are related to various topics that may be uncomfortable to a reader.
                            This includes but is not limited to <span style={{color: "red"}}>violent</span> and <span style={{color: "red"}}>explicit</span> content. There are NO images, but the warning holds regardless.
                        </p> 
                    </Card>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={22}>
                    <Card>
                        <Title level={2}>Description</Title>
                        <p style={{margin: 0}}>
                            Scrape of Our Own is a self-publishing data analyzer for <a href="https://archiveofourown.org/" target="_blank">Archive of Our Own</a> (AO3) that will allow a user to collect, store, and later retrieve information about different published stories over a period of time.
                            Most individuals don't have access to such information because AO3 only stores a limited number of metrics that are viewable over months of time.
                            This web application aims to remedy this problem by allowing an easy, centralized location for a user to scrape and view data they collected. 
                            Targeted at data scientists and authors of the site who want to analyze the website's stories. 
                            This data could be collected daily depending on a user's web scrape requests and the web scraper links would be stored until a user no longer had need of the information, at which point, the scraping would be deleted and the information would be released to users to view publicly. 
                            While the information is available, users would use the web application to view graphs about the growing size of the books, how many views they are obtaining, the user interactions, and other metrics regarding genre and author growth.
                        </p>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={22}>
                    <Card>
                        <Title level={2}>Current Functionality</Title>
                        <p style={{margin: 0}}>
                            
                        </p>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default HomeComponent;