/* ============================================================
   YOUR MELODY JACKPOT — game data
   Emotion bank, genre bank, and 100 rhyming couplets.
   Each couplet is tagged with the emotion + genre it was
   written for; the game serves the closest match to the spin.
   ============================================================ */

const MOODS = [
  "ANGRY", "HAPPY", "SLEEPY", "SCARED", "LOVING", "JEALOUS",
  "SAD", "EXCITED", "NERVOUS", "PROUD", "LONELY", "HOPEFUL",
  "GRUMPY", "EMBARRASSED", "HEARTBROKEN", "SILLY",
  "NOSTALGIC", "SMUG", "RESTLESS", "SUSPICIOUS", "DETERMINED"
];

const GENRES = [
  "ROCK", "OPERA", "KIDS' MUSIC", "FOLK", "RAP", "PUNK",
  "MUSICAL THEATER", "R&B", "GRUNGE", "FUNK", "GOSPEL", "COUNTRY",
  "DISCO", "REGGAE", "JAZZ", "BLUES", "SURF ROCK", "HEAVY METAL",
  "DOO-WOP", "LULLABY", "SPRINGSTEEN", "BRUNO MARS", "THE BEATLES",
  "SHERYL CROW", "DOLLY PARTON", "JOHNNY CASH", "ABBA",
  "BOSSA NOVA", "BLUEGRASS", "MOTOWN", "YACHT ROCK", "NEW WAVE",
  "SKA", "BARBERSHOP QUARTET", "POLKA", "ELVIS", "QUEEN"
];

/* 100 couplets. e = emotion tag, g = genre tag, l = [line1, line2] */
const COUPLETS = [
  // ---- ANGRY ----
  { e: "ANGRY", g: "OPERA", l: ["You finished my spaghetti and you didn't save a bite,", "Prepare to hear me sing about this outrage half the night!"] },
  { e: "ANGRY", g: "ROCK", l: ["Somebody took my parking spot, I circled for an hour,", "Now every chord I'm playing comes out crunchy, loud, and sour."] },
  { e: "ANGRY", g: "HEAVY METAL", l: ["The printer's jammed again, that's four times in a row,", "I summon all the thunder — still it tells me 'paper low.'"] },
  { e: "ANGRY", g: "COUNTRY", l: ["You borrowed my best shovel and returned it full of rust,", "Out here that's the kind of thing that breaks a fella's trust."] },
  { e: "ANGRY", g: "RAP", l: ["You said you'd do the dishes but the sink is piled high,", "I'm counting every dirty fork and asking myself why."] },
  { e: "ANGRY", g: "SPRINGSTEEN", l: ["The factory whistle's blowing and my engine's running hot,", "I worked all week for nothing and it's all the pay I got."] },
  { e: "ANGRY", g: "KIDS' MUSIC", l: ["Stomp, stomp, stomp — I'm a grumpy dinosaur,", "Don't you touch my cookies or you'll hear this dino ROAR!"] },

  // ---- HAPPY ----
  { e: "HAPPY", g: "DISCO", l: ["The weekend's finally here and my shoes are on the floor,", "I'm dancing in the kitchen like I never danced before."] },
  { e: "HAPPY", g: "GOSPEL", l: ["I woke up with the sunshine pouring through my windowpane,", "Got joy down in my soul and it is spilling like the rain."] },
  { e: "HAPPY", g: "THE BEATLES", l: ["The kettle's on, the toast is warm, the morning's soft and slow,", "And every little thing I see has got a golden glow."] },
  { e: "HAPPY", g: "FUNK", l: ["Got a brand-new pair of socks and they are striped in every hue,", "My feet are throwing parties and your feet are invited too."] },
  { e: "HAPPY", g: "FOLK", l: ["The garden's full of tomatoes and the porch is full of friends,", "I hope this summer evening never finds a way to end."] },
  { e: "HAPPY", g: "BRUNO MARS", l: ["Caught my reflection in the window, gave myself a wink,", "Today is going smoother than a roller-skating rink."] },
  { e: "HAPPY", g: "SURF ROCK", l: ["The sun is up, the tide is right, my board is waxed and ready,", "Gonna ride that wave of happy till my legs go all spaghetti."] },

  // ---- SLEEPY ----
  { e: "SLEEPY", g: "PUNK", l: ["I stayed up way too late and now my eyelids feel like lead,", "The only mosh pit I want now is the pillows on my bed."] },
  { e: "SLEEPY", g: "LULLABY", l: ["The moon is in the window and the dog is on the rug,", "The whole world's getting quiet like a slow and sleepy hug."] },
  { e: "SLEEPY", g: "OPERA", l: ["Behold, the mighty yawning that is rising in my chest,", "I sing one final aria, and then I must go rest."] },
  { e: "SLEEPY", g: "JAZZ", l: ["It's half past way-too-late and I am melting in my chair,", "My dreams are warming up downstairs — I really should be there."] },
  { e: "SLEEPY", g: "R&B", l: ["Baby, it's been one long day, my battery's on two,", "All I wanna do tonight is doze right next to you."] },
  { e: "SLEEPY", g: "COUNTRY", l: ["The rooster did his hollering, I did my best to hide,", "There's hay to bale and cows to milk, but sleep is on my side."] },

  // ---- SCARED ----
  { e: "SCARED", g: "COUNTRY", l: ["There's a spider in my boot and I'm too frightened to look,", "I'd rather wrestle ten tornadoes than that eight-legged crook."] },
  { e: "SCARED", g: "DOO-WOP", l: ["The basement light is flickering — sha-la-la, oh no,", "I'm not going down those stairs unless you also go."] },
  { e: "SCARED", g: "HEAVY METAL", l: ["A moth flew in my bedroom and it's circling the light,", "I am armed with just a slipper and I will not win this fight."] },
  { e: "SCARED", g: "MUSICAL THEATER", l: ["The curtain rises Friday and I haven't learned my lines,", "I'm smiling through the terror like the show is going fine!"] },
  { e: "SCARED", g: "RAP", l: ["Heard a creak out in the hallway, now I'm frozen on the spot,", "It's probably just the cat. (It's probably not.)"] },
  { e: "SCARED", g: "KIDS' MUSIC", l: ["There's a monster in my closet with a fuzzy purple head —", "Oh wait, that's just my sweater. I'm going back to bed."] },

  // ---- LOVING ----
  { e: "LOVING", g: "DOO-WOP", l: ["Your smile's like a soda fountain bubbling over sweet,", "Every time you say my name my heart skips half a beat."] },
  { e: "LOVING", g: "THE BEATLES", l: ["I'd carry your umbrella through a hundred rainy Junes,", "And hum your favorite song to you on lazy afternoons."] },
  { e: "LOVING", g: "DOLLY PARTON", l: ["You leave the porch light burning when I'm driving home at night,", "And that one little lightbulb makes my whole world feel right."] },
  { e: "LOVING", g: "R&B", l: ["You saved me the last slice of pie and didn't say a word,", "That's the sweetest love song that this heart has ever heard."] },
  { e: "LOVING", g: "OPERA", l: ["My love is like a thunderstorm that rattles every wall,", "I'll sing it from the rooftop so the neighbors hear it all!"] },
  { e: "LOVING", g: "MUSICAL THEATER", l: ["When you walk into the room the spotlight finds your face,", "The orchestra starts swelling and my heart picks up the pace."] },
  { e: "LOVING", g: "SHERYL CROW", l: ["We're driving with the windows down, the radio's our choir,", "And loving you is easy as a Sunday by the fire."] },

  // ---- JEALOUS ----
  { e: "JEALOUS", g: "FUNK", l: ["Your sandwich looks way better than the sad one on my plate,", "I'm scooting my chair closer before it gets too late."] },
  { e: "JEALOUS", g: "BLUES", l: ["My neighbor's lawn is greener and his truck is shiny new,", "I got a rusty wagon and a window with a view."] },
  { e: "JEALOUS", g: "BRUNO MARS", l: ["You got the fresh white sneakers that I wanted for so long,", "Now I'm staring at your feet and writing this whole song."] },
  { e: "JEALOUS", g: "OPERA", l: ["Her trophy shelf is gleaming with a hundred golden cups,", "Mine holds a single ribbon that just says 'thanks for showing up.'"] },
  { e: "JEALOUS", g: "COUNTRY", l: ["Your dog can fetch the paper and roll over on command,", "My dog just ate my homework and a quarter pound of sand."] },
  { e: "JEALOUS", g: "DISCO", l: ["Everybody's dancing with the partner that I wanted,", "I'm spinning solo anyway, refusing to be daunted."] },

  // ---- SAD ----
  { e: "SAD", g: "BLUES", l: ["My coffee's gone lukewarm and the sky's been gray all day,", "Even my reflection looks like it might walk away."] },
  { e: "SAD", g: "GRUNGE", l: ["The rain is on the window and my band just broke apart,", "There's feedback in my speakers and an echo in my heart."] },
  { e: "SAD", g: "JOHNNY CASH", l: ["The midnight train is rolling and it isn't coming back,", "I'm singing low and lonesome to the clicking of the track."] },
  { e: "SAD", g: "OPERA", l: ["The ice cream truck just passed me by, it didn't even slow,", "I lift my voice in sorrow so the whole town hears my woe!"] },
  { e: "SAD", g: "FOLK", l: ["The summer birds have flown away, the garden's turning brown,", "I'm humming something quiet as the leaves come drifting down."] },
  { e: "SAD", g: "KIDS' MUSIC", l: ["My balloon flew up and up until it disappeared from view,", "Now my string is empty and my crayons all feel blue."] },
  { e: "SAD", g: "MUSICAL THEATER", l: ["The show is over, houselights up, the crowd has gone away,", "I'm singing to the empty seats, pretending that they stayed."] },

  // ---- EXCITED ----
  { e: "EXCITED", g: "SURF ROCK", l: ["The waves are up, the van is packed, I cannot sit still,", "We're peeling out at sunrise, racing daylight down the hill."] },
  { e: "EXCITED", g: "KIDS' MUSIC", l: ["It's my birthday in the morning and I cannot fall asleep,", "I counted seven hundred extra jumpy birthday sheep!"] },
  { e: "EXCITED", g: "RAP", l: ["The pizza's in the oven and the timer says one minute,", "This kitchen is a stadium and I'm the champion in it."] },
  { e: "EXCITED", g: "DISCO", l: ["They just announced the encore and my hands are in the air,", "I've got glitter on my jacket and confetti in my hair."] },
  { e: "EXCITED", g: "SPRINGSTEEN", l: ["We got the tank filled up and we are rolling out tonight,", "The radio is blasting and the city's burning bright."] },
  { e: "EXCITED", g: "ABBA", l: ["The mirror ball is spinning and my heart is set on go,", "Tonight we're gonna dance until the morning starts to show."] },

  // ---- NERVOUS ----
  { e: "NERVOUS", g: "JAZZ", l: ["My palms are doing drum rolls and my knees won't keep the beat,", "I'm improvising confidence with two left-handed feet."] },
  { e: "NERVOUS", g: "MUSICAL THEATER", l: ["The spotlight's getting closer and I think I might be ill,", "But the show must go on, so by golly, then it will!"] },
  { e: "NERVOUS", g: "COUNTRY", l: ["I'm meeting her whole family at the big church potluck spread,", "I've practiced 'pleased to meet you' fifty times inside my head."] },
  { e: "NERVOUS", g: "DOO-WOP", l: ["I wrote her number on my hand but now I'm scared to call,", "I've picked the phone up seven times and dropped it in the hall."] },
  { e: "NERVOUS", g: "RAP", l: ["Big test in first period and I'm pacing in the hall,", "My brain knows all the answers but my stomach missed the call."] },
  { e: "NERVOUS", g: "OPERA", l: ["I must ask one small question, but the asking makes me quake,", "So I will sing it at full volume for the drama's sake!"] },

  // ---- PROUD ----
  { e: "PROUD", g: "GOSPEL", l: ["I built that wobbly bookshelf with my own two blistered hands,", "Can I get a hallelujah? 'Cause it finally, finally stands!"] },
  { e: "PROUD", g: "COUNTRY", l: ["My tomato won a ribbon and I'm walking ten feet tall,", "I taped it to the tractor so it's visible to all."] },
  { e: "PROUD", g: "RAP", l: ["I parallel parked perfectly on my very first try,", "Stand back and watch me strut — I'm the parking samurai."] },
  { e: "PROUD", g: "SPRINGSTEEN", l: ["I fixed that rusty engine that they swore would never run,", "Now listen to her roaring like a river in the sun."] },
  { e: "PROUD", g: "MUSICAL THEATER", l: ["I hit the highest note tonight, the one I always crack,", "The balcony stood up and I am never looking back!"] },
  { e: "PROUD", g: "BRUNO MARS", l: ["I ironed my own dress shirt and it's crisper than the breeze,", "When I step into the office, hold your applause, please."] },

  // ---- LONELY ----
  { e: "LONELY", g: "BLUES", l: ["The diner's nearly empty and my booth is built for four,", "I'm sharing fries with nobody and watching out the door."] },
  { e: "LONELY", g: "JOHNNY CASH", l: ["I'm the only soul for miles on this long and dusty road,", "Just me, my shadow, and a guitar carrying the load."] },
  { e: "LONELY", g: "GRUNGE", l: ["Everyone's at practice and my afternoon is free,", "The garage sounds awful empty when the band is minus me."] },
  { e: "LONELY", g: "FOLK", l: ["The lighthouse keeper waves at ships that never come to shore,", "I know just how he's feeling when my phone don't ring no more."] },
  { e: "LONELY", g: "LULLABY", l: ["The house is awful quiet and it's only me tonight,", "So I'm humming harmony with the refrigerator light."] },
  { e: "LONELY", g: "R&B", l: ["I'm slow dancing in the kitchen with my arms around the air,", "Saving all my smoothest moves for someone who's not there."] },

  // ---- HOPEFUL ----
  { e: "HOPEFUL", g: "GOSPEL", l: ["The storm's been hanging heavy but I see a seam of gold,", "Keep your umbrella ready but your spirit big and bold."] },
  { e: "HOPEFUL", g: "FOLK", l: ["We planted in the winter what we couldn't see in spring,", "But every seed is down there learning how to do its thing."] },
  { e: "HOPEFUL", g: "SPRINGSTEEN", l: ["This town has seen some hard years but the lights are coming on,", "We'll be dancing on the boardwalk by the breaking of the dawn."] },
  { e: "HOPEFUL", g: "REGGAE", l: ["The rain has done its talking, now the sun gets back its say,", "We'll be barefoot in the garden by the middle of the day."] },
  { e: "HOPEFUL", g: "SHERYL CROW", l: ["The lease is up, the car is packed, the map is on my knees,", "The first day of the rest of it is riding on this breeze."] },
  { e: "HOPEFUL", g: "KIDS' MUSIC", l: ["Tomorrow's like a present that is sitting on the shelf,", "I can't wait to unwrap it, so I'm high-fiving myself!"] },

  // ---- GRUMPY ----
  { e: "GRUMPY", g: "PUNK", l: ["It's Monday and it's raining and my toast fell jelly-down,", "I'm starting up a one-man band called Stay Out of My Town."] },
  { e: "GRUMPY", g: "BLUES", l: ["Don't talk to me at sunrise till the coffee's in the cup,", "My give-a-darn is broken and I cannot fix it up."] },
  { e: "GRUMPY", g: "OPERA", l: ["Who scheduled this for 8 a.m.? Produce the guilty name!", "I'll sing my disapproval to the rafters, all the same."] },
  { e: "GRUMPY", g: "HEAVY METAL", l: ["The leaf blower next door has roared since seven on the dot,", "I'm cranking up my amp to share the headache that I got."] },
  { e: "GRUMPY", g: "FOLK", l: ["Get off my vegetable garden, you rabbits and you deer,", "I wrote this gentle protest song so all of you could hear."] },
  { e: "GRUMPY", g: "COUNTRY", l: ["My boots are full of rainwater, my hat blew in the creek,", "I've had it up to here with this entire stinkin' week."] },

  // ---- EMBARRASSED ----
  { e: "EMBARRASSED", g: "DOO-WOP", l: ["I waved at someone waving but they waved at someone else,", "Sha-la-la, I played it cool by waving at myself."] },
  { e: "EMBARRASSED", g: "MUSICAL THEATER", l: ["I tripped on my grand entrance, slid the whole way 'cross the floor,", "So I jazz-handed the landing and they're begging for more."] },
  { e: "EMBARRASSED", g: "RAP", l: ["I called my teacher 'Mom' today, the whole class heard it clear,", "I'm thinking of transferring to the moon for one school year."] },
  { e: "EMBARRASSED", g: "COUNTRY", l: ["My yodel cracked in public at the grocery checkout line,", "The cashier said 'God bless you' and I said that I was fine."] },
  { e: "EMBARRASSED", g: "BRUNO MARS", l: ["I moonwalked through the lobby feeling smoother than the breeze,", "Then spotted toilet paper trailing off my shoe. Oh, jeez."] },
  { e: "EMBARRASSED", g: "OPERA", l: ["I sneezed during the quiet part, it echoed off the dome,", "Three hundred heads all turned at once. I sang, 'I'M GOING HOME.'"] },

  // ---- HEARTBROKEN ----
  { e: "HEARTBROKEN", g: "COUNTRY", l: ["You took the truck, the dog, and all the records off the shelf,", "Now it's just me and one sad cactus talking to myself."] },
  { e: "HEARTBROKEN", g: "DOO-WOP", l: ["You said we'd share a milkshake but you shared it with Eugene,", "Now every cherry on the top reminds me what could've been."] },
  { e: "HEARTBROKEN", g: "BLUES", l: ["You left your toothbrush in the cup, your hoodie on the chair,", "I keep on setting two places for one person who's not there."] },
  { e: "HEARTBROKEN", g: "OPERA", l: ["Return my favorite sweatshirt, though it's stretched beyond repair,", "For it still smells like Saturdays when you pretended to care!"] },
  { e: "HEARTBROKEN", g: "GRUNGE", l: ["You promised me forever, then you didn't even call,", "Now I'm playing minor chords and staring at the wall."] },
  { e: "HEARTBROKEN", g: "THE BEATLES", l: ["Yesterday you held my hand, today you held the door,", "And told me, very kindly, that you don't want to anymore."] },

  // ---- SILLY ----
  { e: "SILLY", g: "KIDS' MUSIC", l: ["My socks are on my ears because my ears were feeling cold,", "Don't knock it till you've tried it, friend — it never gets old!"] },
  { e: "SILLY", g: "FUNK", l: ["The funky chicken called me up and challenged me to dance,", "I said, 'Bring your finest feathers, bird — you haven't got a chance.'"] },
  { e: "SILLY", g: "SURF ROCK", l: ["A seagull stole my sandwich and surfed off on my board,", "Now he's the local legend and I'm the one ignored."] },
  { e: "SILLY", g: "RAP", l: ["My goldfish is my hype man, he bubbles when I rhyme,", "We're dropping our new mixtape, one bubble at a time."] },
  { e: "SILLY", g: "OPERA", l: ["The drama of the moment! The yogurt has expired!", "I shall sing of this great tragedy until my lungs are tired!"] },
  { e: "SILLY", g: "THE BEATLES", l: ["A walrus in a necktie asked me kindly for the time,", "I told him it was half past strange and quarter after rhyme."] },

  /* ---- second hundred: served at random, no tags needed ---- */
  { l: ["My cat knocked over everything that wasn't nailed down tight,", "Then looked at me like I'm the one who hasn't lived life right."] },
  { l: ["The dog next door has opinions and he shares them after ten,", "I bark my answer through the wall and he starts up again."] },
  { l: ["My parakeet learned one new word, and that one word is 'no,'", "Now every family meeting has a hostile CEO."] },
  { l: ["I taught my dog to shake last week; he taught himself to steal,", "We're working through our differences across one missing meal."] },
  { l: ["A squirrel keeps casing out my porch — I've seen him taking notes,", "He's after all my birdseed and he's organizing votes."] },
  { l: ["My hamster runs his wheel all night like rent is overdue,", "I lie awake and wonder where he thinks he's running to."] },
  { l: ["The vet said my chihuahua should be watching what she eats,", "So now we walk an extra block and dream about our treats."] },
  { l: ["My turtle made a break for it — he's halfway down the hall,", "At this rate he'll be free by spring; I'm not worried at all."] },
  { l: ["The cat brought me a present and I wish she'd kept the thought,", "I thanked her very calmly, then I screamed into a pot."] },
  { l: ["The puppy ate my left shoe and a chapter of my book,", "He's lucky he's adorable — I let him off the hook."] },
  { l: ["I burned the garlic bread again; the smoke alarm's my fan,", "It cheers for me the loudest every time I touch a pan."] },
  { l: ["I meal-prepped seven dinners like a hero, like a saint,", "By Tuesday night I ordered pizza — heroes sometimes ain't."] },
  { l: ["The recipe said 'simmer' but my burner heard 'destroy,'", "I'm serving up some charcoal with a garnish of false joy."] },
  { l: ["There's one last cookie in the jar and four of us at home,", "I'm writing up my closing argument like ancient Rome."] },
  { l: ["I salted with a flourish and I plated it with flair,", "It still tastes like a sneaker, but presentation's there."] },
  { l: ["The avocado's window opened Tuesday, ten to two,", "I missed it doing laundry — now it's guacamole glue."] },
  { l: ["Grandma's secret recipe turned out to be 'add more':", "More butter and more sugar, and more butter than before."] },
  { l: ["I told them I like spicy, but I meant it as a thought,", "Now I'm drinking all the milk that this establishment has got."] },
  { l: ["The birthday cake said 'serves sixteen' — a challenge, plain to see,", "I'm sixteen different moods a day, so technically that's me."] },
  { l: ["I grew one single pepper in my garden, just the one,", "I'm planning out a festival to honor what I've done."] },
  { l: ["My password needs a symbol, capital, and ancient rune,", "I'll be locked out of my email till the middle of next June."] },
  { l: ["The update took all evening and my phone now runs much worse,", "The progress bar's a liar and this rectangle's a curse."] },
  { l: ["I joined the video meeting with my camera set to 'on,'", "My hair said 'good morning' and my dignity said 'gone.'"] },
  { l: ["The robot vacuum's stuck again beneath the kitchen chair,", "It bumps and beeps for rescue with a sad robotic flair."] },
  { l: ["Autocorrect just told my boss I'd see him at the 'duck,'", "I typed a quick correction and it changed the word to 'truck.'"] },
  { l: ["The smart speaker misheard me and it's playing polka loud,", "I asked it for the weather — now I'm dancing for a crowd."] },
  { l: ["I've got forty open tabs and every single one's a need,", "My laptop fan is wheezing like it's running at full speed."] },
  { l: ["The wifi dropped at 8 p.m., the household hit the floor,", "We lit a candle, told some tales, like pioneers of yore."] },
  { l: ["My phone announced my screen time like a judge announcing crime,", "Your honor, I was busy — watching videos of slime."] },
  { l: ["I lost my phone while holding it, I searched the whole dang place,", "It rang inside my left hand and I could not show my face."] },
  { l: ["The forecast promised sunshine, so I packed the picnic spread,", "The sky said 'that's adorable' and rained on us instead."] },
  { l: ["It's sweater weather Monday and it's swimsuit hot by three,", "I'm dressing in three layers like a walking history."] },
  { l: ["The first snow's coming down tonight and school's already praying,", "I wore my PJs inside out — the snow-day gods are weighing."] },
  { l: ["The pollen count is rude this year, my sneezes shake the street,", "The neighbors say 'God bless you' from a hundred-yard retreat."] },
  { l: ["It's so hot the sidewalk's cooking and the birds refuse to fly,", "I'm best friends with my freezer and we're never saying bye."] },
  { l: ["The wind undid my hairdo and redid it as a dare,", "I walked into the meeting like I meant it — modern hair."] },
  { l: ["October's showing off again, the maples all turned gold,", "I kick through every leaf pile like I'm seven years old."] },
  { l: ["The fog rolled in so thick today I lost my own front door,", "I greeted my own mailbox like we'd never met before."] },
  { l: ["Spring cleaned the whole sky yesterday, the air smells brand-new green,", "I rolled my windows down and sang to places in between."] },
  { l: ["The thunder did a drum solo, the dog is under the bed,", "I joined him with a flashlight and we're roommates now instead."] },
  { l: ["The laundry's done, the laundry's dry, the laundry's on the chair,", "That chair has been promoted: it's the closet now, I swear."] },
  { l: ["I went in for some toothpaste, that was all, I swear it's true,", "I came out eighty dollars light, with cheese and a canoe."] },
  { l: ["The shopping list said 'milk and eggs' — I left it on the table,", "I bought what I remembered, which was nothing on the label."] },
  { l: ["I vacuumed in straight stripes today, the carpet looks like art,", "I'm charging folks admission just to look at it, sweetheart."] },
  { l: ["The junk drawer ate my scissors and a flashlight and a key,", "One day I'll organize it. (That's a lie I tell with glee.)"] },
  { l: ["I fixed the squeaky hinge today with oil and with pride,", "Now the door's so silent that it startles me inside."] },
  { l: ["I finally returned the cart across the parking lot,", "A small heroic journey, and I think about it a lot."] },
  { l: ["'Assembly takes two hours, with a friend and basic tools' —", "It's midnight, I'm alone, and I respect the Swedish rules."] },
  { l: ["I watered all my houseplants and I told them they looked great,", "The fern perked up immediately; the cactus said 'I'll wait.'"] },
  { l: ["I matched up all the Tupperware with lids that truly fit,", "Then deep inside the cupboard, something chuckled. That was it."] },
  { l: ["My toddler had opinions on the color of her cup,", "Negotiations lasted till the sun was fully up."] },
  { l: ["Grandpa tells the same three stories, each one better than the last,", "The fish gets bigger every year — we cheer the growing bass."] },
  { l: ["My sister 'borrowed' my best shirt and wore it like her own,", "I found it in her closet and I 'borrowed' her cologne."] },
  { l: ["We're playing family board games and the gloves are coming off,", "Grandma took my last paper dollar with a gentle cough."] },
  { l: ["The baby learned to say my name — it came out more like 'Bub,'", "I legally will answer to it now. I joined the club."] },
  { l: ["Dad's grilling in his lucky hat, he says it's nearly there,", "We've all been told it's 'nearly there' since noon, but we don't care."] },
  { l: ["My brother claimed the window seat for nine hundred miles straight,", "I memorized his snore so I can mock it — worth the wait."] },
  { l: ["We can't agree on pizza night, half plain and half supreme,", "The crust is universal, though — on that, we are a team."] },
  { l: ["The house gets quiet after eight, the dishes put away,", "I love the little hum it makes at the ending of the day."] },
  { l: ["We built a blanket fortress and declared the couch a state,", "The dog is now our president; his policies are great."] },
  { l: ["I missed my exit singing to a song I claimed to hate,", "Twelve minutes of detour for a chorus — worth the wait."] },
  { l: ["The GPS, she sighed at me, or maybe that's my guilt,", "I made the legal U-turn with the dignity I'd built."] },
  { l: ["The roadside stand said 'PEACHES' in a hand-painted scrawl,", "We pulled right over, bought a bag, and juice rained on us all."] },
  { l: ["Middle seat, row thirty-two, my knees are in my chin,", "The tiny pretzel bag arrived: a feast! We're dining in."] },
  { l: ["I packed eleven outfits for a weekend at the lake,", "I wore the same two T-shirts — every trip's the same mistake."] },
  { l: ["The motel pool was tiny but the diving felt first-rate,", "We gave each other nines and tens and one dramatic eight."] },
  { l: ["We sang in rounds on Highway 9 until our voices quit,", "Dad whistled out the harmony; the dog approved of it."] },
  { l: ["The rest stop vending machine took my dollar with a grin,", "I gave it one polite tap and the snack gods let me win."] },
  { l: ["The license plate game lasted seventeen entire states,", "We're still missing Alaska and the tension's truly great."] },
  { l: ["We drove out past the city lights to where the stars get loud,", "And ate cold sandwiches like kings beneath a cosmic crowd."] },
  { l: ["I did one single push-up and I'm waiting for applause,", "The second one is coming, after one strategic pause."] },
  { l: ["I stood up from the sofa and my knees played castanets,", "My body's now a rhythm section full of no regrets."] },
  { l: ["I said 'just one more episode' at nine, and meant it true,", "The birds outside are laughing now; the sky's an early blue."] },
  { l: ["The snooze button and I have got a special working deal,", "It asks me 'are you sure?' nine times; I answer with great zeal."] },
  { l: ["I drank my eight tall glasses like the doctors all advise,", "I've memorized the hallway to the bathroom — exercise!"] },
  { l: ["The dentist asked a question with her hands inside my jaw,", "I answered with three vowel sounds; she nodded, struck with awe."] },
  { l: ["I tried to touch my toes today — my toes were way down there,", "We waved at one another from a distance, fair and square."] },
  { l: ["I took a power nap at two, set timers, did it right,", "I woke up Thursday, possibly. What year is it tonight?"] },
  { l: ["I joined a gym in January, motivated, brave,", "We see each other twice a month; the treadmill knows my wave."] },
  { l: ["My step count hit ten thousand and I told everyone twice,", "The mailman didn't ask me, but I told him — he was nice."] },
  { l: ["I remembered both their birthdays and the card arrived on time,", "Somebody check the weather, 'cause I'm clearly in my prime."] },
  { l: ["The jar lid wouldn't budge for years of stronger folks than me,", "One tap, one twist, one POP — I'm now a local legend, see."] },
  { l: ["I caught the glass before it fell, mid-air, without a look,", "The kitchen went dead silent like the ending of a book."] },
  { l: ["I folded one whole fitted sheet to roughly rectangle shape,", "It only took eleven tries and one heroic drape."] },
  { l: ["I guessed the movie's ending in the very second scene,", "They groaned and threw the popcorn, but a prophet must be seen."] },
  { l: ["I sent the email, no typos, attached the file first try,", "I leaned back in my chair like pilots do across the sky."] },
  { l: ["The crossword had one empty box for seventeen long days,", "I woke up shouting 'OBOE!' and I solved it through the haze."] },
  { l: ["I caught the green light wave downtown, all seven in a row,", "I felt like the conductor of a perfect traffic show."] },
  { l: ["I planted one small lemon tree the spring my hopes ran dry,", "This morning there's a lemon, and I might just start to cry."] },
  { l: ["I found a twenty in a coat I haven't worn since fall,", "Past me looked out for future me — the greatest gift of all."] },
  { l: ["My umbrella did a backflip in the wind and flew away,", "I saluted as it left me; it had clearly trained all day."] },
  { l: ["I waved goodbye for one whole block — they kept on standing there,", "Now I either keep on walking or I move. It's only fair."] },
  { l: ["I practiced my acceptance speech with shampoo in my hand,", "The showerhead's my microphone, the steam's my backing band."] },
  { l: ["I told a joke at dinner and it landed on its feet,", "I'm riding that one joke for years; the streak cannot be beat."] },
  { l: ["I organized my bookshelf by the colors of the spines,", "I can't find anything I own, but goodness, how it shines."] },
  { l: ["The escalator stopped mid-ride and turned us into stairs,", "We climbed our broken chariot and put on knowing airs."] },
  { l: ["There's one sock in the dryer and its partner has gone rogue,", "I picture it in Paris now, alive and very vogue."] },
  { l: ["I learned to juggle apples — well, I learned to juggle one,", "The other two are bruising, but we're having lots of fun."] },
  { l: ["My echo in the canyon got the lyrics slightly wrong,", "We went back and forth politely till we harmonized the song."] },
  { l: ["I bought a tiny trophy and engraved it 'DID MY BEST,'", "I hand it to myself most nights; it's better than the rest."] }
];
