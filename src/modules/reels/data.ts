import { duration } from "moment";

export const users = [
  {
    id: 1,
    name: 'User 1',
    stories: [
      {
        id: 1,
        type: 'image',
        content:
          'https://images.pexels.com/photos/29773887/pexels-photo-29773887/free-photo-of-charming-getreidegasse-in-salzburg-austria.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T10:00:00Z',
        views: 120,
        location: 'Paris, France',
        duration: 5
      },
      {
        id: 2,
        type: 'video',
        content: 'https://images.pexels.com/photos/28319523/pexels-photo-28319523/free-photo-of-autumn-vibe-aesthetic.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T11:30:00Z',
        views: 200,
        location: 'New York, USA',
        duration: 10
      },
      {
        id: 3,
        type: 'image',
        content:
          'https://images.pexels.com/photos/29773887/pexels-photo-29773887/free-photo-of-charming-getreidegasse-in-salzburg-austria.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T10:00:00Z',
        views: 120,
        location: 'Paris, France',
      },
      {
        id: 4,
        type: 'video',
        content: 'https://images.pexels.com/photos/28319523/pexels-photo-28319523/free-photo-of-autumn-vibe-aesthetic.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T11:30:00Z',
        views: 200,
        location: 'New York, USA',
      },
    ],
  },
  {
    id: 2,
    name: 'User 2',
    stories: [
      {
        id: 3,
        type: 'image',
        content:
          'https://images.pexels.com/photos/14994705/pexels-photo-14994705/free-photo-of-iced-coffee-on-a-wooden-table.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T09:15:00Z',
        views: 90,
        location: 'London, UK',
      },
      {
        id: 4,
        type: 'video',
        content: 'https://images.pexels.com/photos/29773887/pexels-photo-29773887/free-photo-of-charming-getreidegasse-in-salzburg-austria.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T10:45:00Z',
        views: 150,
        location: 'Tokyo, Japan',
      },
    ],
  },
  {
    id: 3,
    name: 'User 3',
    stories: [
      {
        id: 5,
        type: 'image',
        content:
          'https://images.pexels.com/photos/11407395/pexels-photo-11407395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T08:00:00Z',
        views: 250,
        location: 'Berlin, Germany',
      },
      {
        id: 6,
        type: 'video',
        content: 'https://images.pexels.com/photos/28319523/pexels-photo-28319523/free-photo-of-autumn-vibe-aesthetic.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T12:00:00Z',
        views: 300,
        location: 'Rome, Italy',
      },
    ],
  },
  {
    id: 4,
    name: 'User 4',
    stories: [
      {
        id: 7,
        type: 'image',
        content:
          'https://images.pexels.com/photos/29797528/pexels-photo-29797528/free-photo-of-breathtaking-waterfall-in-lush-tasmania-forest.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
        timestamp: '2024-12-18T07:30:00Z',
        views: 180,
        location: 'Los Angeles, USA',
      },
      {
        id: 8,
        type: 'video',
        content: 'https://example.com/story8.mp4',
        timestamp: '2024-12-18T09:00:00Z',
        views: 220,
        location: 'Sydney, Australia',
      },
    ],
  },
  {
    id: 5,
    name: 'User 5',
    stories: [
      {
        id: 9,
        type: 'image',
        content:
          'https://images.pexels.com/photos/28319523/pexels-photo-28319523/free-photo-of-autumn-vibe-aesthetic.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T06:45:00Z',
        views: 100,
        location: 'Moscow, Russia',
      },
      {
        id: 10,
        type: 'video',
        content: 'https://example.com/story10.mp4',
        timestamp: '2024-12-18T08:30:00Z',
        views: 130,
        location: 'Dubai, UAE',
      },
    ],
  },
  {
    id: 6,
    name: 'User 6',
    stories: [
      {
        id: 11,
        type: 'image',
        content:
          'https://images.pexels.com/photos/28747444/pexels-photo-28747444/free-photo-of-scenic-terraced-rice-fields-with-mountain-view.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
        timestamp: '2024-12-18T07:00:00Z',
        views: 110,
        location: 'Barcelona, Spain',
      },
      {
        id: 12,
        type: 'video',
        content: 'https://example.com/story12.mp4',
        timestamp: '2024-12-18T10:00:00Z',
        views: 140,
        location: 'São Paulo, Brazil',
      },
    ],
  },
  {
    id: 7,
    name: 'User 7',
    stories: [
      {
        id: 13,
        type: 'image',
        content:
          'https://images.pexels.com/photos/29806391/pexels-photo-29806391/free-photo-of-energetic-australian-shepherd-playing-with-ball.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
        timestamp: '2024-12-18T12:30:00Z',
        views: 250,
        location: 'Madrid, Spain',
      },
      {
        id: 14,
        type: 'video',
        content: 'https://example.com/story14.mp4',
        timestamp: '2024-12-18T13:00:00Z',
        views: 300,
        location: 'Cape Town, South Africa',
      },
    ],
  },
  {
    id: 8,
    name: 'User 8',
    stories: [
      {
        id: 15,
        type: 'image',
        content:
          'https://images.pexels.com/photos/28506418/pexels-photo-28506418/free-photo-of-traditional-thai-huts-in-lush-koh-phangan-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
        timestamp: '2024-12-18T11:00:00Z',
        views: 130,
        location: 'Paris, France',
      },
      {
        id: 16,
        type: 'video',
        content: 'https://example.com/story16.mp4',
        timestamp: '2024-12-18T14:00:00Z',
        views: 170,
        location: 'Berlin, Germany',
      },
    ],
  },
  {
    id: 9,
    name: 'User 9',
    stories: [
      {
        id: 17,
        type: 'image',
        content:
          'https://images.pexels.com/photos/29579097/pexels-photo-29579097/free-photo-of-young-woman-photographer-in-istanbul-archway.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
        timestamp: '2024-12-18T10:15:00Z',
        views: 190,
        location: 'Los Angeles, USA',
      },
      {
        id: 18,
        type: 'video',
        content: 'https://example.com/story18.mp4',
        timestamp: '2024-12-18T12:45:00Z',
        views: 210,
        location: 'London, UK',
      },
    ],
  },
  {
    id: 10,
    name: 'User 10',
    stories: [
      {
        id: 19,
        type: 'image',
        content:
          'https://images.pexels.com/photos/28319523/pexels-photo-28319523/free-photo-of-autumn-vibe-aesthetic.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        timestamp: '2024-12-18T11:30:00Z',
        views: 80,
        location: 'Rome, Italy',
      },
      {
        id: 20,
        type: 'video',
        content: 'https://example.com/story20.mp4',
        timestamp: '2024-12-18T13:30:00Z',
        views: 100,
        location: 'Dubai, UAE',
      },
    ],
  },
]
