const express = require('express');
const { mongoose } = require('../utilities/connection');
const { isLoggedIn } = require('../utilities/isloggedin');
const { PostSchema } = require('../schemas/post');
const { UserSchema } = require('../schemas/user');
const { LikeSchema } = require('../schemas/likes');
const { storeSchema } = require('../schemas/store');
const { purchaseSchema } = require('../schemas/purchases');
const { viewsSchema } = require('../schemas/views');
const router = express.Router();

router.get('/insights', isLoggedIn, async (req, res) => {
    try {
        const postmodel = mongoose.model('posts', PostSchema);
        const usermodel = mongoose.model('users', UserSchema);
        const likesmodel = mongoose.model('likes', LikeSchema);
        const viewmodel = mongoose.model('views', viewsSchema);
        const storemodel = mongoose.model('stores', storeSchema);
        const purchasemodel = mongoose.model('purchases', purchaseSchema);

        const user = await usermodel.findById(req.session.login);
       if(!user.isWriter){
    console.log('Permission denied: User is not a writer');
    return res.status(403).json({error: "You don't have permission to access this"});
}

        // Get user posts and calculate likes
        const userpostsarr = await postmodel.find({ author: user });
        let totallikes = 0;
        for (let elm of userpostsarr) {
            totallikes += (await likesmodel.countDocuments({ postid: elm }));
        }

        // Get user items and calculate books sold
        const useritems = await storemodel.find({ uploader: user });
        let totalbooksSold = 0;
        for (let elm of useritems) {
            totalbooksSold += (await purchasemodel.countDocuments({ item: elm }));
        }

        // Get views count
        const viewcount = await viewmodel.findOne({ author: user });
        const totalviews = viewcount ? viewcount.count : 0;

        // Get top 3 posts by likes
        const topPosts = await postmodel.aggregate([
            { $match: { author: user._id } },
            { $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'postid',
                as: 'likes'
            }},
            { $addFields: {
                likeCount: { $size: '$likes' }
            }},
            { $sort: { likeCount: -1 } },
            { $limit: 3 },
            { $project: {
                title: 1,
                likeCount: 1
            }}
        ]);

        // Get monthly activity data
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

        const monthlyData = await postmodel.aggregate([
            { $match: { 
                author: user._id,
                date: { $gte: sixMonthsAgo }
            }},
            { $group: {
                _id: { $month: "$date" },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);

        // Format monthly data for chart
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const activityData = monthlyData.map(item => ({
            month: monthNames[item._id - 1],
            posts: item.count
        }));

        res.status(200).json({ 
            totallikes, 
            totalviews, 
            totalbooksSold,
            topPosts: topPosts.map(post => ({
                title: post.title,
                likes: post.likeCount,
                views: 0 // You'll need to implement views counting if needed
            })),
            activityData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching insights' });
    }
});

module.exports.router = router;