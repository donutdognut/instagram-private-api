import { Expose } from 'class-transformer';
import { Feed } from '../core/feed';
import { MediaLikersFeedResponse, MediaLikersFeedResponseLikersItem } from '../responses/';

export class MediaLikersFeed extends Feed<MediaLikersFeedResponse, MediaLikersFeedResponseLikersItem> {
  id: string;
  @Expose()
  private nextMaxId: string;
  @Expose()
  private nextMinId: string;

  set state(body: MediaLikersFeedResponse) {
    this.moreAvailable = !!body.next_max_id || !!body.next_min_id;
    this.nextMaxId = body.next_max_id;
    this.nextMinId = body.next_min_id;
  }

  async request() {
    const { body } = await this.client.request.send<MediaLikersFeedResponse>({
      url: `/api/v1/media/${this.id}/likers/`,
      qs: {
        can_support_threading: true,
        max_id: this.nextMaxId,
        min_id: this.nextMinId,
      },
    });
    this.state = body;
    return body;
  }

  async items() {
    const response = await this.request();
    return response.likers;
  }
}
