const { validationResult } = require('express-validator');
const WebSocket = require('ws');
const path = require('path');
const { resizeImage } = require('../utils/fileUpload');
const CommentService = require('../services/commentService');
const catchAsync = require('../utils/catchAsync');

class CommentController {
  static createComment = catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text, parentId, homePage } = req.body;
    const userId = req.user.id;
    let fileUrl = null;
    console.log(homePage);
    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) {
        fileUrl = await resizeImage(req.file.path);
      } else if (req.file.mimetype === 'text/plain') {
        fileUrl = req.file.path;
      }
      fileUrl = path.join('/uploads', path.basename(fileUrl));
    }

    const comment = await CommentService.createComment({
      userId,
      text,
      parentId,
      fileUrl,
      homePage,
    });
    res.status(201).json({
      status: 'success',
      data: { comment },
    });

    const wss = req.app.get('wss');
    if (wss && wss.clients) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'NEW_COMMENT',
              data: comment,
            })
          );
        }
      });
    }
  });

  static getComments = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const { comments, totalPages } = await CommentService.getComments({
      page,
      pageSize,
      sortField,
      sortOrder,
    });
    res.json({ status: 'success', data: { comments }, totalPages });
  });
}

module.exports = CommentController;
