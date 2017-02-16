/**
 * ContentfulModel holds configuration values to communicate with
 * Contentful's Delivery API.
 *
 * The default setup uses the space shared with the ios and android demo apps.
 *
 */
export class ContentfulModel {
    constructor(public spaceId:string,
                public apiKey:string,
                public productContentType:string,
                public categoryContentType:string) {
    }
}

