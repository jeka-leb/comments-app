const Comment = require('../models/comment');
const catchAsync = require('../utils/catchAsync');

class CommentService {
  static getComments = catchAsync(
    async ({
      page = 1,
      pageSize = 25,
      sortField = 'createdAt',
      sortOrder = 'desc',
    } = {}) => {
      const offset = (page - 1) * pageSize;

      const validSortFields = ['username', 'email', 'createdAt'];
      if (!validSortFields.includes(sortField)) {
        return next(new AppError('Invalid sort field', 400));
      }
      const order = [[sortField, sortOrder]];

      const { count, rows } = await Comment.findAndCountAll({
        where: { parentId: null },
        offset,
        limit: pageSize,
        order,
      });

      return {
        comments: rows,
        totalPages: Math.ceil(count / pageSize),
      };
    }
  );

  static createComment = catchAsync(async (commentData) => {
    const comment = await Comment.create(commentData);
    return comment;
  });
}

module.exports = CommentService;
