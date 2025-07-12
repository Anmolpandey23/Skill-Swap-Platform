const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create a swap request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { requested_from_user_id, skill_offered, skill_requested, message } = req.body;
    const offered_by_user_id = req.user.id;

    if (!requested_from_user_id || !skill_offered || !skill_requested) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('swaps')
      .insert([
        {
          offered_by_user_id,
          requested_from_user_id,
          skill_offered,
          skill_requested,
          message,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Swap request created', swap: data });
  } catch (error) {
    console.error('Swap creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List swap requests for the current user (as requester or recipient)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('swaps')
      .select('*')
      .or(`offered_by_user_id.eq.${userId},requested_from_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ swaps: data });
  } catch (error) {
    console.error('List swaps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 