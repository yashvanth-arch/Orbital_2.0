/* ORBITAL 2.0 — MISSION 001: ASTEROID RECONNAISSANCE
 * Chapter 01: The Stone That Remembers
 *
 * All pictures live in  story/mission001/images/  and are named exactly as the `file`
 * fields below (.png preferred; .jpg / .webp also work). Missing pictures show a
 * labelled placeholder, so the story is playable before the art exists.
 * Run `node tools/gen_pic_instructions.js` after editing the image list to rebuild
 * story/mission001/pic_instructions.txt.
 */
(function (root) {
  const E = (text, tag) => ({ say: 'ENGINEER', text, tag });
  const S = (text, tag) => ({ say: 'SCIENTIST', text, tag });
  const C = (text, tag) => ({ say: 'CROSS', text, tag });
  const N = (text, tag) => ({ say: 'OKAFOR', text, tag });
  const O = (text, tag) => ({ say: 'ORION', text, tag });
  const U = (text, tag) => ({ say: 'USER', text, tag });
  const ALL = (text) => ({ say: 'ALL', text });

  const M = {
    id: 1,
    code: 'MISSION 001',
    name: 'ASTEROID RECONNAISSANCE',
    chapter: 'THE STONE THAT REMEMBERS',
    folder: 'story/mission001/images',

    chars: {
      ENGINEER:  { name: 'ENGINEER',  sprite: 'char_engineer',  side: 'right', color: '#ffb35c' },
      SCIENTIST: { name: 'SCIENTIST', sprite: 'char_scientist', side: 'left',  color: '#59ffb8' },
      CROSS:     { name: 'COMMANDER ADRIAN CROSS', sprite: 'char_cross',  side: 'right', color: '#ff7a7a' },
      OKAFOR:    { name: 'DR. NIA OKAFOR',         sprite: 'char_okafor', side: 'left',  color: '#c79bff' },
      ORION:     { name: 'ORION', color: '#35d0ff', style: 'orion' },
      USER:      { name: 'USER',  color: '#ffffff', style: 'user' },
      ALL:       { name: 'ALL',   color: '#9fb4c2' },
    },

    /* ------------------------------------------------------------------ IMAGES */
    images: {
      bg_oed_exterior:     { file: 'bg_01_oed_exterior', type: 'bg', scene: 'Scene 01',
        desc: 'Exterior of the Orbital Exploration Directorate (OED) headquarters, early morning, 2042. A sleek glass-and-steel campus with a tall central tower and a ring-shaped observation deck, white and silver with soft blue edge lighting. A rocket/satellite sculpture on the plaza, a few small figures walking in. Clear sky fading from deep blue to a pale orange horizon. Wide establishing shot.' },
      bg_director_office:  { file: 'bg_02_director_office', type: 'bg', scene: 'Scene 01',
        desc: "The user's (Mission Director's) office. A huge floor-to-ceiling window shows Earth hanging in space (the office is in a station/high tower). A modern desk, a digital wall clock and a large wall-mounted mission display that is currently dark/idle. Warm interior lights against the cool blue light from Earth. Leave the centre-left empty-ish: the two characters stand in front of the image." },
      bg_office_asteroid:  { file: 'bg_03_office_display_asteroid', type: 'bg', scene: 'Scene 01',
        desc: 'Exactly the same office and camera angle as bg_02, but the large mission display is now switched on, showing a glowing holographic rotating model of a dark, rocky, top-shaped asteroid (Bennu) with blue wireframe lines and small data readouts. Blue light from the display spills onto the room.' },
      bg_bennu_space:      { file: 'bg_04_bennu_deep_space', type: 'bg', scene: 'Scene 02',
        desc: 'Asteroid 101955 Bennu floating in deep space: a realistic, detailed, spinning-top shaped dark grey carbon-rich asteroid covered in boulders and craters, lit from one side by the Sun, black star-filled background. Place the asteroid on the LEFT-CENTRE of the frame and keep the RIGHT third calm and dark, because info panels are shown there.' },
      bg_bennu_surface:    { file: 'bg_05_bennu_surface_closeup', type: 'bg', scene: 'Scene 02',
        desc: "Close-up of Bennu's surface: a rough landscape of large boulders, jagged rocks, uneven terrain and shadowed craters, dark charcoal-grey with subtle highlights, black sky with a few stars and the curved asteroid horizon in the distance. Photorealistic, harsh raking sunlight, no smooth areas." },
      bg_planning_room:    { file: 'bg_06_planning_room_hologram', type: 'bg', scene: 'Decision 01',
        desc: 'A dark futuristic mission-planning room. A large holographic model of Bennu floats in the centre of a circular holo-table, with two glowing spacecraft trajectory simulations around it: one straight fast line passing by, one spiralling curve that settles into orbit. Blue and cyan holograms, dim room, consoles on the sides. The lower quarter should stay fairly dark.' },
      bg_flyby_preview:    { file: 'bg_07_flyby_preview', type: 'bg', scene: 'Decision 01 / Option A',
        desc: 'Option A preview: a small sleek robotic spacecraft streaking past Bennu at high speed, strong motion blur streaks and a fast glowing trail. Bennu is large and sharp in the middle distance, the spacecraft is a blur crossing in front of it.' },
      bg_flyby_result:     { file: 'bg_08_flyby_result', type: 'bg', scene: 'Decision 01 / Option A (failure)',
        desc: 'The same scene afterwards: the spacecraft has already flown past and is a tiny distant point of light speeding away, Bennu is shrinking and receding behind it into the dark, only partly lit. Feels like a missed opportunity: empty, cold, lonely. Slight red warning tint in the corners.' },
      bg_rendezvous_preview: { file: 'bg_09_rendezvous_preview', type: 'bg', scene: 'Decision 01 / Option B',
        desc: 'Option B preview: the spacecraft slowly approaching Bennu and settling into a calm controlled observation trajectory, with a thin glowing blue orbit line curving around the asteroid. Composed, steady, calm lighting; the spacecraft is clearly visible in the mid-foreground with solar panels extended.' },
      bg_rendezvous_thrusters: { file: 'bg_10_rendezvous_thrusters', type: 'bg', scene: 'Decision 01 / Option B (success)',
        desc: 'The spacecraft close to Bennu, small thrusters firing short blue-white bursts to adjust its trajectory. Bennu fills the background with a visible rocky surface. Subtle blue trajectory line and a small green "locked" marker. Hopeful, successful mood.' },
      bg_control_room_bennu: { file: 'bg_11_control_room_bennu', type: 'bg', scene: 'Scene 03',
        desc: 'Mission control room. A very large central screen shows Bennu rotating, with a clean circular timer/readout beside it that reads "4.3 HOURS". Rows of operator consoles with silhouettes of staff in the foreground, blue-lit, professional. Keep the bottom 25% dark and simple.' },
      bg_observation_model: { file: 'bg_12_observation_model_paths', type: 'bg', scene: 'Decision 02',
        desc: 'A large 3D holographic Bennu model in the centre of a dark room with several glowing coloured observation paths wrapped around it from different angles (like latitude/longitude orbit rings), small camera-cone icons along the paths, and a faint grid. Futuristic UI, blue/cyan with a few amber highlights.' },
      bg_one_hemisphere_preview: { file: 'bg_13_one_hemisphere_preview', type: 'bg', scene: 'Decision 02 / Option A',
        desc: 'Option A preview: the spacecraft observing only one side of Bennu. The observed hemisphere is bright and has blue scan lines on it; the opposite hemisphere is completely dark and unlit, hidden in shadow.' },
      bg_one_hemisphere_result: { file: 'bg_14_one_hemisphere_result', type: 'bg', scene: 'Decision 02 / Option A (failure)',
        desc: 'A flat digital mapping display showing Bennu surface coverage: the left half is filled in with a detailed map, the right half is empty dark grey with hatching and a small red "NO DATA" warning marker. Red-tinged alert lighting.' },
      bg_multi_angle_preview: { file: 'bg_15_multi_angle_preview', type: 'bg', scene: 'Decision 02 / Option B',
        desc: 'Option B preview: the spacecraft shown at several positions around Bennu (ghosted copies along a curved path), viewing the asteroid from different angles as it rotates. A digital surface map panel in a corner is partly filling in with coloured coverage.' },
      bg_multi_angle_result: { file: 'bg_16_multi_angle_result', type: 'bg', scene: 'Decision 02 / Option B (success)',
        desc: 'Same style as bg_15 but later: Bennu has rotated, the spacecraft is following its planned path, and the digital surface map is now almost complete with blue/green coverage and only a few small gaps left. Satisfying, successful mood.' },
      bg_engineering_lab:  { file: 'bg_17_engineering_lab', type: 'bg', scene: 'Scene 04',
        desc: 'A futuristic spacecraft engineering laboratory: a clean white and blue high-tech hangar-like lab, a spacecraft model suspended in the centre held by robotic arms, instrument models (camera, laser altimeter, spectrometer, thermal mapper) floating around it as glowing holograms. Engineers and equipment in the background.' },
      bg_payload_a_preview: { file: 'bg_18_payload_a_preview', type: 'bg', scene: 'Decision 03 / Option A',
        desc: 'Option A preview: a close view of the reconnaissance spacecraft equipped with four instruments (imaging camera, laser altimeter, visible/infrared spectrometer, thermal infrared mapper), each labelled with a tiny glowing blue tag. Dark clean studio-like backdrop with soft blue rim lighting.' },
      bg_payload_a_attached: { file: 'bg_19_payload_a_attached', type: 'bg', scene: 'Decision 03 / Option A (success)',
        desc: 'The finished spacecraft with all four instruments attached, green confirmation check marks glowing beside each one and a payload bar reading "10 / 10" filled. Triumphant, clean, well lit.' },
      bg_payload_b_preview: { file: 'bg_20_payload_b_preview', type: 'bg', scene: 'Decision 03 / Option B',
        desc: 'Option B preview: a spacecraft with a large sample-collection arm extended and a round sample return capsule attached on top, same lab-like backdrop as bg_18. Impressive but bulky.' },
      bg_payload_b_result: { file: 'bg_21_payload_b_result', type: 'bg', scene: 'Decision 03 / Option B (failure)',
        desc: 'The spacecraft configuration screen where the bulky sample arm and capsule take up all the payload space: the camera, altimeter and spectrometers are shown as faded grey outlines marked with red X symbols. Red warning overlay, payload bar overfilled in red.' },
      bg_mission_control_large: { file: 'bg_22_mission_control_large', type: 'bg', scene: 'Scene 05',
        desc: 'A large, impressive mission control room. Multiple big wall displays show the spacecraft, Bennu and mission statistics. A full-size spacecraft model stands in the centre of the room under soft spotlights. Staff at consoles in the background. Blue and white lighting, cinematic.' },
      bg_hangar:           { file: 'bg_23_hangar_launch_prep', type: 'bg', scene: 'Scene 05',
        desc: 'A spacecraft hangar. Engineers in white suits work around the finished spacecraft, launch-preparation lights (amber and green) are turning on along the walls, cables and gantries, a big door beginning to open to a bright sunrise outside.' },
      bg_launch_pad:       { file: 'bg_24_launch_pad', type: 'bg', scene: 'Scene 06',
        desc: 'The spacecraft mounted on top of a tall launch vehicle on the launch pad at dawn, surrounded by gantry towers and floodlights, steam venting from the base. A large digital countdown clock is visible in the lower corner. Dramatic wide shot.' },
      bg_ignition:         { file: 'bg_25_ignition', type: 'bg', scene: 'Scene 06',
        desc: 'Engine ignition: bright white-orange flames and a huge billow of smoke and steam illuminate the launch pad and gantry, the rocket just beginning to lift. Intense light, sparks, shaking energy.' },
      bg_rising:           { file: 'bg_26_liftoff_rising', type: 'bg', scene: 'Scene 06',
        desc: 'The rocket rising into a blue sky on a long bright exhaust plume, camera low looking up, the ground and launch tower falling away below, thin clouds. Sense of speed and power.' },
      bg_space_cruise:     { file: 'bg_27_space_cruise', type: 'bg', scene: 'Scene 06',
        desc: 'The spacecraft travelling through space with Earth large and beautiful behind it, thin blue atmosphere glow along the horizon, sunlight glinting on the solar panels. Calm and awe-inspiring.' },
      bg_separation:       { file: 'bg_28_separation', type: 'bg', scene: 'Scene 06',
        desc: 'The spacecraft separating from the spent upper stage of the launch vehicle, small puffs of gas at the separation point, solar panels beginning to unfold, Earth curving below.' },
      bg_bennu_distance:   { file: 'bg_29_bennu_distance', type: 'bg', scene: 'Scene 06',
        desc: 'Deep space with the spacecraft small in the foreground and Bennu appearing as a small, faint grey point/shape in the far distance, lit by sunlight. Vast empty space, stars, a sense of long travel.' },
      bg_bennu_approach:   { file: 'bg_30_bennu_approach', type: 'bg', scene: 'Scene 07',
        desc: 'The spacecraft approaching Bennu. The asteroid fills most of the screen as a huge detailed rocky world, the small spacecraft in the lower right giving a sense of scale, a thin blue trajectory line leading in. Keep the centre area fairly calm because a status panel is displayed there.' },
      bg_final_zoomout:    { file: 'bg_31_final_zoomout', type: 'bg', scene: 'Scene 07',
        desc: 'Final wide shot: the camera has zoomed out and the small spacecraft and Bennu are visible together against a field of stars, the Sun a bright flare on one edge. Peaceful, hopeful, epic ending shot.' },

      char_engineer:  { file: 'char_engineer', type: 'sprite', scene: 'Characters',
        desc: 'ENGINEER: Senior Mission Systems Engineer, one of the two creators of the game. Practical, confident, a bit dry-humoured. Wears a dark navy OED mission jumpsuit/jacket with amber accents, an ID badge, maybe a headset around the neck. Standing, 3/4 body, facing LEFT (toward the middle of the screen), friendly neutral expression. Free to be styled after one of the game creators.' },
      char_scientist: { file: 'char_scientist', type: 'sprite', scene: 'Characters',
        desc: 'SCIENTIST: Lead Mission Scientist, the other creator. Warm, enthusiastic, curious. Wears a white lab coat over a navy OED shirt with green accents, a tablet in one hand. Standing, 3/4 body, facing RIGHT (toward the middle of the screen), friendly smiling expression. Free to be styled after the other game creator.' },
      char_cross:     { file: 'char_cross', type: 'sprite', scene: 'Characters',
        desc: 'COMMANDER ADRIAN CROSS: Flight Operations Director. Authoritative, calm, experienced, about 50. Short greying hair, formal dark OED dress uniform with commander insignia and red accents. Standing straight, hands behind back or arms folded, 3/4 body, facing LEFT.' },
      char_okafor:    { file: 'char_okafor', type: 'sprite', scene: 'Characters',
        desc: 'DR. NIA OKAFOR: Planetary Geologist. Smart, expressive, passionate about rocks. Natural hair or braids, field-science jacket in dark grey with purple accents, a rock sample or hand lens in her hand. Standing, 3/4 body, facing RIGHT, thoughtful friendly expression.' },
    },

    /* ------------------------------------------------------------------- STORY */
    steps: [
      { title: { small: 'ORBITAL 2.0 // MISSION 001', big: 'THE STONE THAT REMEMBERS', sub: 'CHAPTER 01' }, ms: 3200 },

      /* ---------- SCENE 01 — THE APPOINTMENT ---------- */
      { title: { small: 'SCENE 01', big: 'THE APPOINTMENT' }, ms: 2200 },
      { bg: 'bg_oed_exterior', wait: 2400 },
      { bg: 'bg_director_office' },
      E('Ah, there you are. We were waiting for you, user.'),
      S("Good morning! I hope you've had your coffee. You're going to need it."),
      U('Should I be worried?'),
      S("Not yet. We've got something interesting for you."),
      E('Our science division has shortlisted a target for our first reconnaissance mission.'),
      { bg: 'bg_office_asteroid', keep: true },
      S('Meet asteroid 101955 Bennu.'),
      U("Bennu? I've heard that name before."),
      S("You should have. NASA's OSIRIS-REx spacecraft visited Bennu, collected a sample in 2020, and returned it to Earth in 2023."),
      E('But our mission has a different purpose. We need to design a reconnaissance spacecraft that can study Bennu and prepare us for future exploration.'),
      U('So, what exactly do you need me to do?'),
      E("Lead the mission. You'll make the important decisions: mission approach, observation strategy, and scientific equipment."),
      S("We'll help you understand the science and engineering. But the final decisions are yours."),
      O('Mission 001 initialized. Target identification confirmed: 101955 Bennu.'),
      O('Loading available NASA scientific data.'),

      /* ---------- SCENE 02 — KNOW YOUR TARGET ---------- */
      { title: { small: 'SCENE 02', big: 'KNOW YOUR TARGET' }, ms: 2200 },
      { bg: 'bg_bennu_space' },
      { panel: { title: 'ORION — REAL NASA DATA', pos: 'right', rows: [
        ['Object', '101955 Bennu'],
        ['Approximate diameter', '492 metres'],
        ['Rotation period', 'Approximately 4.3 hours'],
        ['Orbital period', 'Approximately 1.2 Earth years'],
        ['Classification', 'B-type, carbon-rich near-Earth asteroid'],
      ] } },
      S('Bennu is a carbon-rich asteroid. Studying objects like this can help scientists understand the early solar system and the materials that existed when planets formed.'),
      U('It looks small compared to a planet.'),
      S("It is. But don't underestimate it. Its surface is covered with rocks and boulders, which makes close operations challenging."),
      { panel: null },
      { bg: 'bg_bennu_surface' },
      N("The surface isn't smooth like the illustrations you usually see. There are large boulders, uneven terrain, and areas that could make future landing attempts difficult."),
      E("That means we shouldn't rush into landing. First, we need to understand the asteroid's shape, rotation, surface features, and hazards."),
      U('Understood. We need to study it before attempting anything more complicated.'),
      S("Exactly. Now, let's decide how our spacecraft should approach Bennu."),

      /* ---------- DECISION 01 ---------- */
      { bg: 'bg_planning_room' },
      E('User, we need to choose the spacecraft\'s approach.'),
      E('Remember, our primary objective is detailed reconnaissance. We need enough time near Bennu to observe it properly.'),
      O('The spacecraft must collect detailed surface and scientific observations. A short encounter may not provide sufficient information.', 'MISSION CONSTRAINT'),
      U('What are our options?'),
      { bg: 'bg_flyby_preview' },
      E('Option A is a high-speed flyby. It would be simpler in some ways. The spacecraft would pass Bennu at high speed and collect observations during the encounter.'),
      S("But we'd have limited time to study the surface. We could miss important details and fail to build a sufficiently complete reconnaissance map."),
      { bg: 'bg_rendezvous_preview' },
      E('Option B is a controlled rendezvous. The spacecraft will approach Bennu carefully and perform a planned reconnaissance campaign.'),
      S('That gives us time to observe the asteroid from different angles, understand its rotation, and map its surface.'),
      { choice: {
        title: 'DECISION 01 — CHOOSE THE MISSION APPROACH',
        objective: 'Primary objective: detailed reconnaissance of Bennu.',
        options: [
          { label: 'HIGH-SPEED FLYBY', sub: 'Pass Bennu at high speed and collect observations during the encounter.',
            result: [
              { bg: 'bg_flyby_result' },
              O('Insufficient observation time.', 'MISSION FAILURE'),
              E('We passed the target before collecting the information required for our mission.'),
              S('A flyby can be useful for a quick encounter, but our objective requires a sustained observation campaign.'),
              { fail: 'Mission approach did not support detailed reconnaissance.' },
            ] },
          { label: 'CONTROLLED RENDEZVOUS AND RECONNAISSANCE', sub: 'Approach gradually and enter a controlled observation trajectory.',
            result: [
              { bg: 'bg_rendezvous_thrusters' },
              O('Mission approach accepted.'),
              O('Rendezvous strategy selected. Reconnaissance operations can proceed.'),
              E('Good decision, user. We need controlled observations, not just a quick look.'),
              S('Now we need to decide how to observe an asteroid that rotates every 4.3 hours.'),
            ] },
        ] } },

      /* ---------- SCENE 03 — THE ROTATING WORLD ---------- */
      { title: { small: 'SCENE 03', big: 'THE ROTATING WORLD' }, ms: 2200 },
      { bg: 'bg_control_room_bennu' },
      O("Bennu's approximate rotation period is 4.3 hours.", 'REAL NASA DATA'),
      S('That means the asteroid rotates once roughly every 4.3 hours.'),
      U("So if we observe only one side, we'll miss the other side."),
      S('Exactly. We need observations from multiple viewing angles.'),
      E("And we need to coordinate our observations with the spacecraft's position and Bennu's rotation."),
      N('A proper surface map can help identify boulders, unusual terrain, and areas that may be important for future exploration.'),
      U('Then we need a complete observation plan.'),
      E("That's your next decision."),

      /* ---------- DECISION 02 ---------- */
      { bg: 'bg_observation_model' },
      O('Create a useful reconnaissance map of Bennu\'s surface using multiple viewing angles and observations across its rotation.', 'MISSION OBJECTIVE'),
      { bg: 'bg_one_hemisphere_preview' },
      S('Option A is to observe only one hemisphere. This would be faster and easier to plan.'),
      E('But it leaves a major part of the asteroid unobserved. We cannot claim to have a useful global reconnaissance map.'),
      { bg: 'bg_multi_angle_preview' },
      S('Option B is a coordinated multi-angle survey. We should coordinate observations across at least one full rotation and use multiple viewing angles.'),
      E('That gives us a much better chance of mapping the surface and identifying important terrain features.'),
      { choice: {
        title: 'DECISION 02 — SELECT THE OBSERVATION STRATEGY',
        objective: 'Objective: a useful reconnaissance map using multiple viewing angles across the rotation.',
        options: [
          { label: 'OBSERVE ONLY ONE HEMISPHERE', sub: 'Faster and easier to plan.',
            result: [
              { bg: 'bg_one_hemisphere_result' },
              O('Incomplete surface coverage detected.', 'MISSION FAILURE'),
              S('We cannot properly assess the asteroid if we ignore half of its surface.'),
              E('Our mission requires observations from multiple viewing angles. We need to try again.'),
              { fail: 'Insufficient surface coverage.' },
            ] },
          { label: 'COORDINATED MULTI-ANGLE SURVEY', sub: 'Observe across a full rotation from multiple viewing angles.',
            result: [
              { bg: 'bg_multi_angle_result' },
              O('Observation strategy accepted.'),
              O('Surface coverage increasing.'),
              N("Excellent. We're beginning to build a useful picture of the asteroid's surface."),
              S('Now we need to equip the spacecraft with instruments that can actually collect the information we need.'),
            ] },
        ] } },

      /* ---------- SCENE 04 — BUILD THE SCIENCE PAYLOAD ---------- */
      { title: { small: 'SCENE 04', big: 'BUILD THE SCIENCE PAYLOAD' }, ms: 2200 },
      { bg: 'bg_engineering_lab' },
      E("User, the spacecraft's scientific payload is next."),
      U('What instruments do we need?'),
      S('Different instruments answer different questions. A camera helps us see the surface. A laser altimeter helps measure shape and elevation. Spectrometers help us understand composition.'),
      O('Loading simplified instrument information.'),
      { panel: { title: 'INSTRUMENT INFORMATION — EDUCATIONAL GAME DATA', pos: 'center', wide: true, rows: [
        ['Imaging Camera', "Captures detailed images of Bennu's surface."],
        ['Laser Altimeter', 'Measures distance and helps create a three-dimensional shape model.'],
        ['Visible and Infrared Spectrometer', 'Helps identify minerals and surface materials.'],
        ['Thermal Infrared Mapper', 'Measures thermal behaviour and helps study surface properties.'],
      ] } },
      E('We have limited spacecraft resources. We need to select equipment that supports the mission objective.'),
      { panel: { title: 'ORION — SIMULATED MISSION PARAMETERS', pos: 'center', note: 'Available payload capacity: 10 units.', rows: [
        ['Imaging Camera', '2 units'],
        ['Laser Altimeter', '3 units'],
        ['Visible/Infrared Spectrometer', '3 units'],
        ['Thermal Infrared Mapper', '2 units'],
        ['Total', '10 units'],
      ] } },
      S('These allocation units are simplified game values, not the real mass or power requirements of NASA instruments.'),
      U('So we need a balanced set of instruments for reconnaissance.'),
      E('Exactly. Choose carefully.'),
      { panel: null },

      /* ---------- DECISION 03 ---------- */
      { bg: 'bg_payload_a_preview' },
      S('Option A is the reconnaissance science package. This package supports our main objectives.'),
      S('The camera will capture surface images. The laser altimeter will help us build a shape model. The spectrometers will help us study composition and thermal properties.'),
      E('The total allocation is 10 units, exactly within our simulated payload limit.'),
      { bg: 'bg_payload_b_preview' },
      U('What if we focus on collecting a sample instead?'),
      S("Sample collection is scientifically valuable. NASA's OSIRIS-REx mission demonstrated how important that can be."),
      E('But this spacecraft is being designed for reconnaissance. A sample collection and return system would use resources that our current objectives need for mapping and remote observations.'),
      { choice: {
        title: 'DECISION 03 — SELECT THE SCIENTIFIC PAYLOAD',
        objective: 'Available payload capacity: 10 units.',
        options: [
          { label: 'RECONNAISSANCE SCIENCE PACKAGE', sub: 'Camera, laser altimeter, visible/infrared spectrometer and thermal mapper — 10 units.',
            result: [
              { bg: 'bg_payload_a_attached' },
              O('Payload configuration accepted.'),
              O('Total allocation: 10 out of 10 units.'),
              O('All primary reconnaissance objectives supported.'),
              E('Perfect. We have a spacecraft designed for the mission we actually want to perform.'),
              S("We're ready for the final mission review."),
            ] },
          { label: 'SAMPLE COLLECTION AND RETURN PACKAGE', sub: 'A sample collection arm and return capsule.',
            result: [
              { bg: 'bg_payload_b_result' },
              O('Payload does not support primary reconnaissance objectives.', 'MISSION FAILURE'),
              S('A sample return mission is a different mission design. We need to first understand the asteroid and identify important areas.'),
              E("We selected the wrong equipment for our mission objective. Let's correct the payload."),
              { fail: 'Payload configuration does not support reconnaissance objectives.' },
            ] },
        ] } },

      /* ---------- SCENE 05 — FINAL MISSION REVIEW ---------- */
      { title: { small: 'SCENE 05', big: 'FINAL MISSION REVIEW' }, ms: 2200 },
      { bg: 'bg_mission_control_large' },
      C("User, I've reviewed the mission plan. Let's see what we've prepared."),
      { panel: { title: 'ORION — MISSION SUMMARY', pos: 'center', rows: [
        ['Mission', '001 — Asteroid Reconnaissance'],
        ['Target', '101955 Bennu'],
        ['Mission approach', 'Controlled rendezvous'],
        ['Observation strategy', 'Multi-angle survey'],
        ['Payload', 'Reconnaissance science package'],
      ] } },
      C('The mission plan supports our primary objective. Good work.'),
      E('The spacecraft configuration is ready for final engineering checks.'),
      S('And our science team is ready to analyse the observations.'),
      U("Then let's get this spacecraft ready."),
      C('Approved. Prepare for launch.'),
      { panel: null },
      { bg: 'bg_hangar', wait: 2600 },

      /* ---------- SCENE 06 — LAUNCH ---------- */
      { title: { small: 'SCENE 06', big: 'LAUNCH' }, ms: 2200 },
      { bg: 'bg_launch_pad' },
      O('Launch sequence initiated.'),
      O('T-minus 10 seconds.'),
      ALL('10... 9... 8... 7...'),
      { bg: 'bg_ignition' },
      ALL('3... 2... 1...'),
      O('Liftoff confirmed.'),
      { bg: 'bg_rising', wait: 2400 },
      { bg: 'bg_space_cruise' },
      S('There it goes.'),
      E('Months of planning, and now the real work begins.'),
      U("Let's make sure it gets there safely."),
      { bg: 'bg_separation' },
      O('Spacecraft separation confirmed.'),
      O('Primary systems nominal.'),
      { bg: 'bg_bennu_distance', wait: 2600 },

      /* ---------- SCENE 07 — MISSION SUCCESS ---------- */
      { title: { small: 'SCENE 07', big: 'MISSION SUCCESS' }, ms: 2200 },
      { bg: 'bg_bennu_approach' },
      { panel: { title: 'ORION — MISSION STATUS', pos: 'center', rows: [
        ['Target approach', 'Successful'],
        ['Reconnaissance trajectory', 'Confirmed'],
        ['Observation plan', 'Ready'],
        ['Scientific payload', 'Operational'],
        ['Mission design review', 'Passed'],
      ] } },
      S("User, we've reached the beginning of our reconnaissance operations."),
      E('The spacecraft is ready to begin collecting the data we designed it for.'),
      U("Then let's find out what Bennu has been hiding."),
      S("I have a feeling we're going to learn a lot from this little asteroid."),
      E('Not bad for your first mission, user.'),
      { panel: null },
      { bg: 'bg_final_zoomout' },
      O('Mission 001 design phase completed successfully.'),

      { success: {
        title: 'MISSION 001 COMPLETED',
        name: 'ASTEROID RECONNAISSANCE',
        scoreTitle: 'MISSION DESIGN SCORE',
        scores: [['Mission approach', 'Passed'], ['Observation strategy', 'Passed'], ['Payload selection', 'Passed']],
        achievementTitle: 'NEW ACHIEVEMENT UNLOCKED',
        achievement: 'FIRST STEPS INTO DEEP SPACE',
        button: 'CONTINUE TO NEXT MISSION',
      } },
      { end: { logo: 'ORBITAL 2.0', line: 'THE UNIVERSE IS WAITING.', sub: 'MISSION 002 — LOCKED' } },
    ],
  };

  root.MISSIONS = root.MISSIONS || {};
  root.MISSIONS[1] = M;
  if (typeof module !== 'undefined') module.exports = M;
})(typeof window !== 'undefined' ? window : globalThis);
