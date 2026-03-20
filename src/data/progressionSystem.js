export const progressionSystem = {
  xp: {
    byLessonType: {
      core_learn: 20,
      reinforce: 15,
      build: 20,
      real_use: 25,
      checkpoint: 40,
    },
    bonuses: {
      perfectLesson: 10,
      fiveLessonStreak: 20,
      unitCompletion: 100,
      checkpointFirstTry: 30,
    },
    premiumBoostPercent: 15,
  },

  energy: {
    freeUsers: {
      max: 100,
      costs: {
        core_learn: 10,
        reinforce: 8,
        build: 10,
        real_use: 10,
        checkpoint: 15,
      },
      refillWithXp: {
        plus20: 60,
        plus50: 140,
        full: 250,
      },
    },
    premiumUsers: {
      enabled: false,
    },
  },

  reviewEngine: {
    ratios: {
      new: 0.6,
      recent: 0.25,
      older: 0.15,
    },
    targetReviewPoolSizes: {
      recent: 30,
      older: 120,
    },
    reviewLessonRules: {
      recentDominant: true,
      checkpointPullsFromWholeUnit: true,
    },
  },

  premiumContent: {
    xpBoostPercent: 15,
    unlocks: [
      "challenge_lessons",
      "boss_levels",
      "fluency_drills",
      "real_scenarios",
    ],
    examples: [
      {
        level: "A1",
        title: "Berlin Café Scenario",
        xpCost: 150,
        rewardXp: 75,
      },
      {
        level: "B2",
        title: "Business Negotiation in Berlin",
        xpCost: 350,
        rewardXp: 120,
      },
    ],
  },

  leaderboard: {
    mode: "weekly_xp",
    rewards: {
      first: 100,
      second: 75,
      third: 50,
      topTen: 25,
    },
  },
};
