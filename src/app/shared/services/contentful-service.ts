import {Config} from '../../config';
/**
 * ContentfulService is using the Contentful JS SDK to load data from contentful.
 * As the actual content of this demos is limited in size, the service loads all
 * entries at once on initialization. All sub queries do filter this initial result
 * set on subsequent calls.
 *
 */

// Require Contentful's JS SDK for delivery.
let contentful = require('contentful');

import {Injectable} from '@angular/core';
import {ContentfulModel} from './contentful-model';

@Injectable()
export class ContentfulService {


    public isUserSessionStored = false;

    public isUserSpaceLoaded = false;

    public model:ContentfulModel;

    private sdkClient;

    private entriesPromise:Promise<any>;

    constructor() {

        this.model = new ContentfulModel(Config.SPACE_ID, Config.API_KEY, Config.PRODUCT_CONTENT_TYPE_ID, Config.CATEGORY_CONTENT_TYPE_ID);

        this.connect();
    }



    public getSpace() {
        return this.sdkClient.space();
    }

    public getProducts(categoryId:string = null) {
        // Maintain scope in promises.
        return this.entriesPromise.then((entries:any[]) => {
            // Filter all entries.
            return entries.filter(
                (entry:any) => {
                    // Filter by category if applicable.
                    if (categoryId != null) {
                        let categoryMatch;
                        for (let i in entry.fields.categories) {
                            if (entry.fields.categories[i].sys.id === categoryId) {
                                categoryMatch = true;
                                continue;
                            }
                        }
                        return entry.sys.contentType.sys.id === this.model.productContentType &&
                            categoryMatch;
                        // Or filter by products.
                    } else {
                        return entry.sys.contentType.sys.id === this.model.productContentType;
                    }
                }
            );
        });
    }

    public getProduct(productId:string = null) {
        return this.entriesPromise.then((entries:any[]) => {
            return entries.filter((entry:any) => {
                return entry.sys.id === productId;
            });
        });
    }

    public getCategories() {
        let categoryContentType = this.model.categoryContentType;
      debugger;
        return this.entriesPromise.then((entries:any[]) => {
            return entries.filter((entry:any) => {
                return entry.sys.contentType.sys.id === categoryContentType;
            });
        });
    }

    public setSessionCredentials(apiKey:string, spaceId:string):void {
        console.log('setSessionCredentials\n', 'spaceId: ' + spaceId + '\n', 'apiKey: ' + apiKey + '\n');
        this.isUserSessionStored = true;
        sessionStorage.setItem(Config.SESSION_STORAGE_API_KEY, apiKey);
        sessionStorage.setItem(Config.SESSION_STORAGE_SPACE_ID, spaceId);
    }

    public clearSessionCredentials():void {
        console.log('removeSessionCredentials');
        this.isUserSessionStored = false;
        sessionStorage.removeItem(Config.SESSION_STORAGE_API_KEY);
        sessionStorage.removeItem(Config.SESSION_STORAGE_SPACE_ID);
    }

    private connect() {

        // Bootstrap from user session if present.
        let spaceId = sessionStorage.getItem(Config.SESSION_STORAGE_SPACE_ID);
        let apiKey = sessionStorage.getItem(Config.SESSION_STORAGE_API_KEY);

        if (spaceId && apiKey) {

            console.log('bootstrapped session:\n', 'spaceId: ' + spaceId + '\n', 'apiKey: ' + apiKey + '\n');

            this.isUserSessionStored = true;
            this.isUserSpaceLoaded = true;

            this.model.spaceId = spaceId;
            this.model.apiKey = apiKey;
        }

        this.sdkClient = contentful.createClient({
            space: this.model.spaceId,
            accessToken: this.model.apiKey
        });

        this.entriesPromise = this.sdkClient.entries().then(function (data) {
            return data;
        }).catch(function (reason) {
            console.error('Could not connect to space:', this.model.spaceId);
            console.log(reason);
        });
    }
}
