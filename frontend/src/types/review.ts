export interface Review {
  id: number;
  rating: number;
  created_at: string;
  user_name: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  average_rating: string | number;
  total_reviews: number;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_name: string;
}