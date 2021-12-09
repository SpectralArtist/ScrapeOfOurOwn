export interface StoryProps {
    archiveId: string;
    name: string;
}

export interface SearchProps {
    search: string;
}

export interface StoryTotalsModel {
    totalStories: number;
    totalChapters: number;
    totalWords: number;
    totalComments: number;
    totalViews: number;
    totalLikes: number;
    averageStories: number;
    averageChapters: number;
    averageWords: number;
    averageComments: number;
    averageViews: number;
    averageLikes: number;
}

export interface StoryModel {
    ​​id: number,
    authorId: number,
    ​​title: string,
    ​​chapters: number,
    words: number,
    ​​views: number,
    ​​likes: number,
    ​​comments: number,
    ​​complete: boolean,
    tags: string[]
}