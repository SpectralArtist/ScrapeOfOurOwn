export interface ScatterProps {
    xaxis: string;
    yaxis: string;
}

export interface StoryScatterModel {
    ​​id: number,
    authorId: number,
    ​​title: string,
    ​​chapters: number,
    words: number,
    ​​views: number,
    ​​likes: number,
    ​​comments: number,
    ​​complete: string
}
