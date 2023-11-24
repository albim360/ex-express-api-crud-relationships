const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware per la validazione dei dati
const validatePost = [
  body('title').notEmpty().withMessage('Il titolo non può essere vuoto'),
  body('content').notEmpty().withMessage('Il contenuto non può essere vuoto'),
];

// Middleware di gestione degli errori
const errorHandler = (err, req, res, next) => {
  console.error('Errore:', err);
  res.status(500).json({ error: 'Qualcosa è andato storto' });
};

// Endpoint per creare un nuovo post
router.post('/posts', validatePost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        slug,
      },
    });

    res.json(newPost);
  } catch (error) {
    next(error);
  }
});

// Endpoint per recuperare un post utilizzando lo slug
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post non trovato' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// Endpoint per recuperare tutti i post con opzioni di filtro
router.get('/posts', async (req, res) => {
  try {
    const { published, keyword } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        published: published === 'true',
        OR: [
          {
            title: {
              contains: keyword || '',
            },
          },
          {
            content: {
              contains: keyword || '',
            },
          },
        ],
      },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// Endpoint per aggiornare un post
router.put('/posts/:slug', validatePost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { slug } = req.params;
    const { title, content } = req.body;

    const updatedPost = await prisma.post.update({
      where: {
        slug,
      },
      data: {
        title,
        content,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// Endpoint per eliminare un post
router.delete('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const deletedPost = await prisma.post.delete({
      where: {
        slug,
      },
    });

    res.json(deletedPost);
  } catch (error) {
    next(error);
  }
});

// Middleware di gestione degli errori globale
router.use(errorHandler);

module.exports = router;
