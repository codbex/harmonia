// Onyx Chat demo dataset. Timestamps are computed relative to page load so the
// Today / Yesterday day separators are always truthful; within one session the
// dataset is fully deterministic (there is no randomness anywhere).
// The "chat" Alpine store clones this object, so it must stay pure data.
const now = Date.now();
// A timestamp some minutes before page load (used for messages "from today").
const minutesAgo = (m) => new Date(now - m * 60000).toISOString();
// A timestamp on the day `daysBack` days ago at a fixed local time (used for
// older messages; only safe for daysBack >= 1, today uses minutesAgo instead).
const at = (daysBack, hour, minute) => {
  const date = new Date(now - daysBack * 86400000);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

window.OnyxData = {
  // The first user is the signed-in demo user; the rest are teammates.
  // Each user gets a distinct avatar color (data-color) covering every standard
  // palette color except black and white, matched to an initial where one shares
  // a letter with the color name (Gonzalez green, Olivia orange, Ivan indigo,
  // Brown blue, Petrova pink).
  users: [
    { id: 'you', name: 'John Doe', initials: 'JD', color: 'teal', title: 'Product Engineer', email: 'john@onyx.example', status: 'online' },
    { id: 'maria', name: 'Maria Gonzalez', initials: 'MG', color: 'green', title: 'Design Lead', email: 'maria@onyx.example', status: 'online' },
    { id: 'olivia', name: 'Olivia Davis', initials: 'OD', color: 'orange', title: 'Frontend Engineer', email: 'olivia@onyx.example', status: 'online' },
    { id: 'ivan', name: 'Ivan Strashimechkarov', initials: 'IS', color: 'indigo', title: 'Backend Engineer', email: 'ivan@onyx.example', status: 'away' },
    { id: 'liam', name: 'Liam Smith', initials: 'LS', color: 'yellow', title: 'Product Manager', email: 'liam@onyx.example', status: 'online' },
    { id: 'noah', name: 'Noah Brown', initials: 'NB', color: 'blue', title: 'QA Engineer', email: 'noah@onyx.example', status: 'offline' },
    { id: 'anna', name: 'Anna Petrova', initials: 'AP', color: 'pink', title: 'Support Lead', email: 'anna@onyx.example', status: 'online' },
    { id: 'emma', name: 'Emma Johnson', initials: 'EJ', color: 'red', title: 'Data Analyst', email: 'emma@onyx.example', status: 'away' },
    { id: 'william', name: 'William Wilson', initials: 'WW', color: 'gray', title: 'DevOps Engineer', email: 'william@onyx.example', status: 'offline' },
    { id: 'sophia', name: 'Sophia Moore', initials: 'SM', color: 'purple', title: 'Engineering Manager', email: 'sophia@onyx.example', status: 'online' },
  ],

  channels: [
    {
      id: 'general',
      name: 'general',
      topic: 'Company-wide announcements and chatter',
      description: 'The default channel for the whole team. Announcements, questions, and anything that does not have a better home.',
      memberIds: ['you', 'maria', 'olivia', 'ivan', 'liam', 'noah', 'anna', 'emma', 'william', 'sophia'],
      joined: true,
      unread: 0,
      messages: [
        { id: 'gen-01', userId: 'sophia', text: 'Welcome to the new quarter everyone! Roadmap review is on Thursday at 10:00.', ts: at(2, 9, 15), reactions: [], edited: false, mentions: [] },
        { id: 'gen-02', userId: 'liam', text: 'Added the agenda to the shared drive. Bring your open questions.', ts: at(2, 9, 22), reactions: [], edited: false, mentions: [] },
        { id: 'gen-03', userId: 'anna', text: 'Support volume was up 12 percent last week, mostly password reset confusion.', ts: at(2, 16, 40), reactions: [], edited: false, mentions: [] },
        { id: 'gen-04', userId: 'olivia', text: 'Deploy preview for the billing page is up - takes about a minute to build.', ts: at(1, 10, 5), reactions: [{ emoji: '👍', userIds: ['you', 'liam'] }], edited: false, mentions: [] },
        { id: 'gen-05', userId: 'olivia', text: 'Heads up that the preview URL changed, the old one returns a 404 now.', ts: at(1, 10, 7), reactions: [], edited: false, mentions: [] },
        { id: 'gen-06', userId: 'william', text: 'Rolling restart of the staging cluster at noon, expect a short blip.', ts: at(1, 11, 30), reactions: [], edited: false, mentions: [] },
        { id: 'gen-07', userId: 'liam', text: 'Reminder: expense reports are due Friday, not Monday as I wrote earlier.', ts: at(1, 15, 45), reactions: [], edited: true, mentions: [] },
        {
          id: 'gen-08',
          userId: 'you',
          text: 'Shipped the onboarding revamp to production. Watch the funnel dashboards and shout if anything looks off.',
          ts: at(1, 16, 10),
          reactions: [
            { emoji: '🎉', userIds: ['liam', 'maria'] },
            { emoji: '👀', userIds: ['sophia'] },
          ],
          edited: false,
          mentions: [],
        },
        { id: 'gen-09', userId: 'sophia', text: '@John can you take a quick look at the beta signup flow before the Thursday review?', ts: minutesAgo(170), reactions: [], edited: false, mentions: ['you'] },
        { id: 'gen-10', userId: 'emma', text: 'Weekly metrics digest is out, activation is trending up nicely.', ts: minutesAgo(120), reactions: [], edited: false, mentions: [] },
        { id: 'gen-11', userId: 'noah', text: 'Regression suite is green on the release branch.', ts: minutesAgo(45), reactions: [], edited: false, mentions: [] },
        { id: 'gen-12', userId: 'anna', text: 'Customer call in 20 minutes, join if you want raw feedback on search.', ts: minutesAgo(12), reactions: [], edited: false, mentions: [] },
      ],
    },
    {
      id: 'design',
      name: 'design',
      topic: 'Design reviews and Figma links',
      description: 'Critiques, design system updates, and everything visual. Post work in progress early and often.',
      memberIds: ['you', 'maria', 'olivia', 'liam', 'emma', 'sophia'],
      joined: true,
      unread: 2,
      messages: [
        { id: 'des-01', userId: 'maria', text: 'New spacing scale proposal is in Figma, comments welcome until Wednesday.', ts: at(2, 11, 20), reactions: [], edited: false, mentions: [] },
        { id: 'des-02', userId: 'olivia', text: 'Left a few notes on the table density variants.', ts: at(2, 11, 50), reactions: [], edited: false, mentions: [] },
        { id: 'des-03', userId: 'you', text: 'Uploaded interaction mockups for the empty states.', ts: at(1, 9, 40), reactions: [{ emoji: '👍', userIds: ['olivia', 'maria'] }], edited: false, mentions: [] },
        { id: 'des-04', userId: 'maria', text: '@John these are great, the search empty state especially.', ts: at(1, 9, 42), reactions: [], edited: false, mentions: ['you'] },
        { id: 'des-05', userId: 'liam', text: 'Can we align the chip colors with the new palette before the sprint demo?', ts: at(1, 14, 20), reactions: [], edited: false, mentions: [] },
        { id: 'des-06', userId: 'maria', text: 'Yes, the palette tokens land tomorrow.', ts: at(1, 14, 26), reactions: [], edited: false, mentions: [] },
        { id: 'des-07', userId: 'emma', text: 'The dashboard heatmaps could use the same treatment.', ts: at(1, 17, 5), reactions: [], edited: false, mentions: [] },
        { id: 'des-08', userId: 'sophia', text: 'Design crit moved to 14:00 tomorrow, same room.', ts: minutesAgo(200), reactions: [], edited: false, mentions: [] },
        { id: 'des-09', userId: 'maria', text: 'Fresh icon batch is exported and tagged in the library.', ts: minutesAgo(38), reactions: [], edited: false, mentions: [] },
        { id: 'des-10', userId: 'maria', text: 'It includes the new presence dots in three sizes.', ts: minutesAgo(36), reactions: [], edited: false, mentions: [] },
      ],
    },
    {
      id: 'engineering',
      name: 'engineering',
      topic: 'Build, deploy, and architecture',
      description: 'Technical discussion for the whole engineering group: architecture, tooling, incidents, and PRs that need eyes.',
      memberIds: ['you', 'olivia', 'ivan', 'william', 'noah', 'sophia'],
      joined: true,
      unread: 0,
      messages: [
        { id: 'eng-01', userId: 'ivan', text: 'Query planner regression is fixed, sorting on messages is fast again.', ts: at(2, 10, 10), reactions: [], edited: false, mentions: [] },
        { id: 'eng-02', userId: 'william', text: "Nice, deploying the patch with tonight's build.", ts: at(2, 10, 30), reactions: [], edited: false, mentions: [] },
        { id: 'eng-03', userId: 'olivia', text: 'Refactored the composer state handling, PR is up.', ts: at(2, 15, 15), reactions: [], edited: false, mentions: [] },
        { id: 'eng-04', userId: 'noah', text: 'Found a flaky test in the websocket suite, quarantined it for now.', ts: at(1, 9, 25), reactions: [], edited: false, mentions: [] },
        { id: 'eng-05', userId: 'ivan', text: '@John the presence service API you asked about is documented in the wiki now.', ts: at(1, 13, 40), reactions: [], edited: false, mentions: ['you'] },
        { id: 'eng-06', userId: 'sophia', text: 'Good milestone everyone, the reconnect logic is much cleaner.', ts: at(1, 13, 55), reactions: [], edited: false, mentions: [] },
        { id: 'eng-07', userId: 'you', text: 'Agreed, huge thanks to Ivan for the groundwork.', ts: at(1, 14, 2), reactions: [{ emoji: '❤️', userIds: ['ivan'] }], edited: false, mentions: [] },
        { id: 'eng-08', userId: 'william', text: 'Build times are down 40 percent after the cache change.', ts: minutesAgo(260), reactions: [{ emoji: '🎉', userIds: ['you', 'olivia'] }], edited: false, mentions: [] },
        { id: 'eng-09', userId: 'olivia', text: 'Storybook is updated with the new split panel examples.', ts: minutesAgo(90), reactions: [], edited: false, mentions: [] },
        { id: 'eng-10', userId: 'ivan', text: 'Migration dry run finished clean on the staging snapshot.', ts: minutesAgo(52), reactions: [], edited: false, mentions: [] },
        { id: 'eng-11', userId: 'noah', text: 'Smoke tests pass on the latest build.', ts: minutesAgo(15), reactions: [], edited: false, mentions: [] },
      ],
    },
    {
      id: 'releases',
      name: 'releases',
      topic: 'Release notes and deploy announcements',
      description: 'One post per release or deploy. Keep discussion in engineering and use this channel as the audit trail.',
      memberIds: ['you', 'olivia', 'william', 'noah', 'sophia'],
      joined: true,
      unread: 0,
      messages: [
        { id: 'rel-01', userId: 'sophia', text: 'v2.4.0 is tagged. Highlights: faster search, emoji reactions, better keyboard navigation.', ts: at(2, 17, 0), reactions: [], edited: false, mentions: [] },
        { id: 'rel-02', userId: 'william', text: 'Rollout reached 100 percent, error rates flat.', ts: at(2, 17, 5), reactions: [], edited: false, mentions: [] },
        { id: 'rel-03', userId: 'noah', text: 'Patch 2.4.1 fixes the notification badge counter.', ts: at(1, 10, 15), reactions: [], edited: false, mentions: [] },
        { id: 'rel-04', userId: 'olivia', text: 'It also includes the composer draft fix.', ts: at(1, 10, 20), reactions: [], edited: false, mentions: [] },
        { id: 'rel-05', userId: 'william', text: 'Canary for 2.5.0 starts tomorrow morning.', ts: minutesAgo(300), reactions: [], edited: false, mentions: [] },
        { id: 'rel-06', userId: 'sophia', text: 'Release notes draft is ready for review.', ts: minutesAgo(75), reactions: [], edited: false, mentions: [] },
      ],
    },
    {
      id: 'random',
      name: 'random',
      topic: 'Off-topic, snacks and weekend plans',
      description: 'The watercooler. Anything goes as long as it is friendly.',
      memberIds: ['you', 'maria', 'olivia', 'ivan', 'liam', 'noah', 'anna', 'emma', 'william', 'sophia'],
      joined: true,
      unread: 0,
      messages: [
        { id: 'ran-01', userId: 'liam', text: 'Lunch thread: the new place on 5th has excellent ramen.', ts: at(1, 12, 30), reactions: [], edited: false, mentions: [] },
        { id: 'ran-02', userId: 'anna', text: 'Seconded, the miso one is great.', ts: at(1, 12, 34), reactions: [{ emoji: '😄', userIds: ['liam'] }], edited: false, mentions: [] },
        { id: 'ran-03', userId: 'william', text: 'Friday playlist suggestions welcome.', ts: minutesAgo(220), reactions: [], edited: false, mentions: [] },
        { id: 'ran-04', userId: 'emma', text: 'Adding some synthwave to it.', ts: minutesAgo(130), reactions: [], edited: false, mentions: [] },
        { id: 'ran-05', userId: 'noah', text: 'Office plant status: thriving.', ts: minutesAgo(28), reactions: [], edited: false, mentions: [] },
      ],
    },
    {
      id: 'support',
      name: 'support',
      topic: 'Customer escalations and support handoffs',
      description: 'Where support and product meet. Escalations, tricky tickets, and follow-ups that need engineering eyes.',
      memberIds: ['anna', 'liam', 'noah', 'sophia'],
      joined: false,
      unread: 0,
      messages: [
        { id: 'sup-01', userId: 'anna', text: 'Escalation queue is empty this morning, nice work everyone.', ts: at(1, 9, 10), reactions: [], edited: false, mentions: [] },
        { id: 'sup-02', userId: 'liam', text: 'Enterprise trial questions are trending up, drafting an FAQ.', ts: at(1, 11, 45), reactions: [], edited: false, mentions: [] },
        { id: 'sup-03', userId: 'anna', text: 'Two tickets about export timeouts, engineering is looking.', ts: minutesAgo(140), reactions: [], edited: false, mentions: [] },
        { id: 'sup-04', userId: 'noah', text: 'Repro steps added to both tickets.', ts: minutesAgo(60), reactions: [], edited: false, mentions: [] },
      ],
    },
  ],

  // Direct message threads, keyed by the other participant's user id.
  dms: [
    {
      id: 'maria',
      userId: 'maria',
      unread: 1,
      messages: [
        { id: 'dmm-01', userId: 'maria', text: 'Do you have 15 minutes tomorrow to walk through the empty states?', ts: at(1, 15, 30), reactions: [], edited: false, mentions: [] },
        { id: 'dmm-02', userId: 'you', text: 'Sure, after standup works.', ts: at(1, 15, 34), reactions: [], edited: false, mentions: [] },
        { id: 'dmm-03', userId: 'maria', text: 'Perfect, calendar invite sent.', ts: at(1, 15, 35), reactions: [], edited: false, mentions: [] },
        { id: 'dmm-04', userId: 'you', text: 'The sketches look great by the way.', ts: minutesAgo(95), reactions: [], edited: false, mentions: [] },
        { id: 'dmm-05', userId: 'maria', text: 'Thanks! I iterated on the empty state twice more.', ts: minutesAgo(90), reactions: [{ emoji: '👍', userIds: ['you'] }], edited: false, mentions: [] },
        { id: 'dmm-06', userId: 'maria', text: 'One more thing, can we swap the icon on the reactions tooltip?', ts: minutesAgo(9), reactions: [], edited: false, mentions: [] },
      ],
    },
    {
      id: 'ivan',
      userId: 'ivan',
      unread: 0,
      messages: [
        { id: 'dmi-01', userId: 'you', text: 'Is the presence API stable enough to build the sidebar dots on?', ts: at(2, 13, 10), reactions: [], edited: false, mentions: [] },
        { id: 'dmi-02', userId: 'ivan', text: 'Yes, just respect the 30 second heartbeat.', ts: at(2, 13, 25), reactions: [], edited: false, mentions: [] },
        { id: 'dmi-03', userId: 'you', text: 'Great, wiring it up.', ts: at(2, 13, 26), reactions: [], edited: false, mentions: [] },
        { id: 'dmi-04', userId: 'ivan', text: 'Pushed a small fix for the away status edge case.', ts: at(1, 10, 45), reactions: [], edited: false, mentions: [] },
        { id: 'dmi-05', userId: 'you', text: 'Saw it, thanks.', ts: at(1, 10, 52), reactions: [], edited: false, mentions: [] },
      ],
    },
    {
      id: 'olivia',
      userId: 'olivia',
      unread: 0,
      messages: [
        { id: 'dmo-01', userId: 'olivia', text: 'Your review comments on the composer PR were spot on.', ts: at(2, 16, 20), reactions: [], edited: false, mentions: [] },
        { id: 'dmo-02', userId: 'you', text: 'Happy to help, the draft handling was tricky.', ts: at(2, 16, 25), reactions: [], edited: false, mentions: [] },
        { id: 'dmo-03', userId: 'olivia', text: 'Merging tomorrow once the flaky test is sorted.', ts: at(2, 16, 26), reactions: [], edited: false, mentions: [] },
        { id: 'dmo-04', userId: 'you', text: 'Sounds good.', ts: at(2, 16, 30), reactions: [], edited: false, mentions: [] },
      ],
    },
  ],

  // Canned replies for the send simulation, keyed by conversation key
  // ("general" for channels, "dms/maria" for direct messages). Entries are
  // cycled deterministically; mentionYou entries feed the Activity page.
  replyScripts: {
    general: [
      { userId: 'liam', text: 'Good point, adding it to the roadmap notes.' },
      { userId: 'sophia', text: 'Thanks for flagging this. @John let us sync on it after standup.', mentionYou: true },
      { userId: 'anna', text: 'I will pass that along to the support team.' },
      { userId: 'emma', text: 'The numbers back that up, I will share a chart shortly.' },
    ],
    design: [
      { userId: 'maria', text: 'Love it. I will fold that into the next Figma pass.' },
      { userId: 'olivia', text: 'Agreed, that also simplifies the component states.' },
      { userId: 'maria', text: '@John want to pair on this tomorrow morning?', mentionYou: true },
    ],
    engineering: [
      { userId: 'ivan', text: 'Makes sense. I will sketch the API change today.' },
      { userId: 'william', text: 'The deploy pipeline can handle that, no infra changes needed.' },
      { userId: 'noah', text: 'I will add a test case for that scenario.' },
    ],
    releases: [
      { userId: 'sophia', text: 'Noted for the release checklist.' },
      { userId: 'william', text: 'I will fold that into the canary plan.' },
    ],
    random: [
      { userId: 'liam', text: 'Ha, strong agree.' },
      { userId: 'anna', text: 'This thread delivers every time.' },
    ],
    support: [
      { userId: 'anna', text: 'Good catch, updating the macro now.' },
      { userId: 'noah', text: 'Adding it to the test matrix.' },
    ],
    'dms/maria': [
      { userId: 'maria', text: 'Sounds good to me!' },
      { userId: 'maria', text: 'Can do. I will have an updated frame by the afternoon.' },
      { userId: 'maria', text: 'Yes, and thanks again for the quick feedback.' },
    ],
    'dms/ivan': [
      { userId: 'ivan', text: 'On it. Give me an hour.' },
      { userId: 'ivan', text: 'That matches what I am seeing in the logs.' },
    ],
    'dms/olivia': [
      { userId: 'olivia', text: 'Exactly my thinking.' },
      { userId: 'olivia', text: 'I will push a branch so we can compare.' },
    ],
    // Used for DMs opened at runtime from the People page; the store fills in
    // the partner's userId.
    dmFallback: [{ text: 'Thanks for the message! Let me get back to you in a bit.' }, { text: 'Interesting, tell me more.' }, { text: 'Agreed. Let us pick this up tomorrow.' }],
  },

  // Scripted cross-channel messages: every second send drops one of these into
  // its channel to demonstrate unread badges and toasts while you are elsewhere.
  sideEvents: [
    { channelId: 'releases', userId: 'william', text: 'Canary is at 25 percent, metrics look healthy.' },
    { channelId: 'releases', userId: 'sophia', text: 'Docs team finished the 2.5.0 changelog review.' },
    { channelId: 'releases', userId: 'noah', text: 'No regressions in the canary cohort so far.' },
    { channelId: 'releases', userId: 'olivia', text: 'Feature flags for the new composer are ready to flip.' },
  ],

  // Fixed picker set; emoji are plain text characters, no icon library involved.
  emojiSet: ['👍', '❤️', '😄', '🎉', '👀', '✅'],
};
