import {User} from "@/iam/domain/model/user.entity.js";
/**
 * Infrastructure assembler to transform user data between resources and domain entities.
 *
 * @class UserAssembler
 */
export class UserAssembler {
    /**
     * Transforms an infrastructure resource into a domain User entity.
     * @param {import('./sign-in.resource.js').SignInResource} resource - The authentication resource.
     * @returns {User}
     */
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new User({
            id: resource.id,
            username: resource.username,
            roles: resource.roles || []
        });
    }

    /**
     * Maps a list response of users into domain entities.
     * @param {import('axios').AxiosResponse} response
     * @returns {Array<User>}
     */
    static toEntitiesFromResponse(response) {
        if (!response || !response.data) return [];
        return response.data.map(item => new User({
            id: item.id,
            username: item.username,
            roles: item.roles || []
        }));
    }
}