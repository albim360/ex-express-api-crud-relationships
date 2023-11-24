const express = require('express');
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const router = express.Router();
const prisma = new PrismaClient();

// Endpoint per creare un nuovo post
router.post('/posts', async (req, res) => {
  try {
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
    console.error("Errore durante la creazione del post:", error);
    res.status(500).json({ error: "Errore durante la creazione del post" });
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
      return res.status(404).json({ error: "Post non trovato" });
    }

    res.json(post);
  } catch (error) {
    console.error("Errore durante la ricerca del post:", error);
    res.status(500).json({ error: "Errore durante la ricerca del post" });
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
    console.error("Errore durante il recupero dei post:", error);
    res.status(500).json({ error: "Errore durante il recupero dei post" });
  }
});

// Endpoint per aggiornare un post
router.put('/posts/:slug', async (req, res) => {
  try {
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
    console.error("Errore durante l'aggiornamento del post:", error);
    res.status(500).json({ error: "Errore durante l'aggiornamento del post" });
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
    console.error("Errore durante l'eliminazione del post:", error);
    res.status(500).json({ error: "Errore durante l'eliminazione del post" });
  }
});

module.exports = router;
