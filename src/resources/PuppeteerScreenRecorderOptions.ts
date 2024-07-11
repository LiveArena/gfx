export interface PuppeteerScreenRecorderOptions{
    followNewTab: boolean;
    fps?: number;
    quality?: number;
    format?: 'jpeg' | 'png';
    ffmpeg_Path?: string | null;
    videoFrame?: {
        width: number | null;
        height: number | null;
      };
      aspectRatio?: '3:2' | '4:3' | '16:9';
      videoCodec?: string;
      videoBitrate?: number;
      videoCrf?: number;
      videoPreset?: string;
      videoPixelFormat?: string;
      videOutputOptions?: string[];
      autopad?: {
        color?: string;
      };
      recordDurationLimit?: number;
      metadata?: string[];

}