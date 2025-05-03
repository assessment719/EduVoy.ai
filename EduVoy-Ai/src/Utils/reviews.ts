export type ReviewCategory = 'students' | 'recruiters';

export interface Review {
    id: string;
    category: ReviewCategory;
    userName: string;
    address: string;
    thumbnailUrl: string;
    videoUrl: string;
}