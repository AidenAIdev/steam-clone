import groupRoutes from './routes/groupRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import consentRoutes from './routes/consentRoutes.js';

export default function registerCommunityRoutes(app) {
    app.use('/api/community/groups', groupRoutes);
    app.use('/api/community/forum', forumRoutes);
    app.use('/api/community/consent', consentRoutes);
    app.use('/api/community', communityRoutes);
}
