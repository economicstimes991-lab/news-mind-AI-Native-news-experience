const profiles = new Map();

function defaultProfile(userId = 'guest') {
  return {
    userId,
    persona: 'student',
    interests: ['markets', 'ai'],
    roleType: 'student',
    updatedAt: new Date().toISOString()
  };
}

function upsertProfile(input = {}) {
  const userId = (input.userId || 'guest').trim();
  const current = profiles.get(userId) || defaultProfile(userId);

  const next = {
    ...current,
    ...input,
    userId,
    interests: Array.isArray(input.interests) ? input.interests : current.interests,
    updatedAt: new Date().toISOString()
  };

  profiles.set(userId, next);
  return next;
}

function getProfile(userId = 'guest') {
  return profiles.get(userId) || defaultProfile(userId);
}

module.exports = {
  upsertProfile,
  getProfile
};