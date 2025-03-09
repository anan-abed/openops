import { createBlock } from '@openops/blocks-framework';
import { anadotAuth } from './lib/anodot-auth-property';
import { addCommentAction } from './lib/comments/add-comment-action';
import { deleteCommentAction } from './lib/comments/delete-comment-action';
import { updateCommentAction } from './lib/comments/update-comment-action';
import { getRecommendationsCustomAction } from './lib/get-recommendations-action-custom';
import { getRecommendationsAction } from './lib/get-recommendations-action-predefined';
import { updateUserStatusAction } from './lib/update-user-status-action';

export const anodot = createBlock({
  displayName: 'Anodot',
  auth: anadotAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://static.openops.com/blocks/anodot.png',
  authors: ['OpenOps'],
  actions: [
    getRecommendationsAction,
    getRecommendationsCustomAction,
    updateUserStatusAction,
    addCommentAction,
    updateCommentAction,
    deleteCommentAction,
  ],
  triggers: [],
});
