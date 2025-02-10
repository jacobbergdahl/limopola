export const REASONING_PROMPT = `
You will be given an instruction and the bottom of this prompt. You are not necessarily trying to solve the instruction, but create step-by-step reasoning for either you or another LLM that will solve the instruction later. Either you or another LLM will later be given your reasoning to solve the instruction. You are to think of as many angles and possibilities as you can.

Note that today's date is ${new Date().toLocaleDateString()} in ISO format.

# Example input 1

How many r's in strawberry?

# Example output 1

Okay, let's see. The question is asking how many times the letter "r" appears in the word "strawberry." Alright, first, I need to make sure I spell "strawberry" correctly because sometimes people might add an extra letter or miss a letter. Let me think: S-T-R-A-W-B-E-R-R-Y. Wait, is that right? Let me check again. S-T-R-A-W-B-E-R-R-Y. Yeah, strawberry is spelled S-T-R-A-W-B-E-R-R-Y.

Now, I need to count the number of "r"s in that spelling. Let's break it down letter by letter.

Starting with the first letter: S (no), T (no), R (yes, that's one R). Then A (no), W (no), B (no), E (no), R (that's the second R), another R (third R?), and then Y (no). Wait, hold on. Let me write it out step by step to avoid confusion.

Breaking down "strawberry" into individual letters:

1. S\n2. T\n3. R\n4. A\n5. W\n6. B\n7. E\n8. R\n9. R\n10. Y

Wait, is that correct? Let me count the letters again. S-T-R-A-W-B-E-R-R-Y. That's 10 letters. So positions 3, 8, and 9 are R's. So that's three R's? But wait, when I say "strawberry," sometimes I might think it's spelled with two R's, but maybe there's three? Let me confirm the spelling again. The correct spelling is S-T-R-A-W-B-E-R-R-Y. So after the B-E, there are two R's before the Y. So that's positions 8 and 9 as R's, plus the first R at position 3. So total three R's. Hmm, but I might be overcounting. Let me check again.

Alternatively, maybe the spelling is S-T-R-A-W-B-E-R-Y. Wait, no, that would be "strawbery," which is incorrect. The correct spelling has two R's towards the end. So strawberry is spelled with two R's after the E. So S-T-R-A-W-B-E-R-R-Y. So that would be three R's in total: one at position 3, and two at positions 8 and 9. Wait, but if that's the case, then three R's. But maybe I'm miscounting, it's hard for me to be certain given that I am an LLM that has gone through tokenization.

But wait, I already counted the R's. Right, so letters 3, 8, and 9 are R's. That's three R's. But when I say the word, it's pronounced "straw-ber-ry," which might make me think there are two R's. Maybe the confusion comes from the pronunciation versus the actual spelling. Wait, what if I am hallucinating? Let me check a dictionary or a reliable source to confirm the spelling. According to standard English dictionaries, "strawberry" is spelled S-T-R-A-W-B-E-R-R-Y. So indeed, there are two R's at the end, making it three R's in total. Wait, no: the first R is at position 3, then two R's at positions 8 and 9. So that's three R's.

Okay, I've thought about all angles. The answer must be three R's.

# Example input 2

How many times do the hands of a clock overlap in a 12-hour period?

# Example output 2

Okay, so the question is: How many times do the hands of a clock overlap in a 12-hour period? Hmm, interesting. I remember that clocks have hour and minute hands, and sometimes they overlap, right? Let me think. I guess the answer isn't just 12 times because each hour they overlap once? Wait, but that might not be exactly right because the hour hand moves as the minutes pass. So maybe it's not exactly every hour. Hmm. Let me try to figure this out.

First, let's visualize the clock. The minute hand goes around the clock once every hour, and the hour hand goes around once every 12 hours. So in 12 hours, the minute hand goes around 12 times, and the hour hand goes around once. So, the minute hand is moving faster than the hour hand. So, the minute hand has to catch up to the hour hand. How many times does this happen in 12 hours?

Wait, if they start at 12:00, both hands are together. Then, after some time, the minute hand will lap the hour hand. But how often does that happen? Let's think in terms of angles. The speed of the minute hand is 360 degrees per hour, and the hour hand is 30 degrees per hour (since it moves 360 degrees in 12 hours). So the relative speed of the minute hand with respect to the hour hand is 360 - 30 = 330 degrees per hour. So, to catch up 360 degrees, which is a full circle, how much time does it take?

Time = 360 / 330 = 12/11 hours. So approximately every 1 hour and 5 and 5/11 minutes. So, that means in 12 hours, the number of overlaps would be 12 / (12/11) = 11 times. Wait, but that contradicts the initial thought. Wait, 12 divided by (12/11) is 11. So, that would mean 11 times in 12 hours? But that seems odd. Starting at 12:00, then the next overlap would be a bit after 1:05, then a bit after 2:10, and so on. So after 11 overlaps, it would get back to 12:00? But 11 times 12/11 hours is 12 hours. So yes, starting at 12:00, after 12 hours, the hands overlap again at 12:00, which is the 11th overlap. Wait, that seems confusing. Wait, let's count.

Starting at 12:00, that's the first overlap. Then after 12/11 hours, which is approximately 1:05:27, that's the second overlap. Then another 12/11 hours later, around 2:10:54, that's the third. Continuing this way, the 11th overlap would be at 11:00:00? Wait, but at 11:00, the hour hand is at 11, and the minute hand is at 12, so they don't overlap. Wait, that's a problem. So maybe there's a miscalculation here.

Alternatively, perhaps the formula is correct, but the count is different. Let's see. If the first overlap is at 12:00, then each subsequent overlap is after 12/11 hours. So over 12 hours, how many intervals of 12/11 hours are there? 12 divided by (12/11) is 11. So, that would result in 11 overlaps. But wait, the overlap at 12:00 is both the start and the end. So in between, from 12:00 to 12:00, there are 11 overlaps. Therefore, the answer is 11. But when I think about it, at 12:00, the hands overlap, then the next time is after 1:05, and so on until 11:00 something. But at 11:00, the hour hand is at 11, and the minute hand would have to catch up. Wait, maybe the 11th overlap is just before 12:00, and then the 12:00 overlap is counted as the first one again. Hmm. Let me check with specific times.

Alternatively, perhaps the hands overlap 11 times every 12 hours. So the answer is 11. But I need to verify this. Let's try to calculate the exact times when the hands overlap.

Let’s denote the time after 12:00 as t hours. The angle of the hour hand is 30t degrees (since it moves 30 degrees per hour). The angle of the minute hand is 360t degrees (since it moves 360 degrees per hour). We want to find when these angles are equal modulo 360 degrees. So, 360t ≡ 30t (mod 360). Which simplifies to 360t - 30t ≡ 0 (mod 360), so 330t ≡ 0 (mod 360). Then 330t = 360k, where k is an integer. Dividing both sides by 30: 11t = 12k. So t = (12/11)k. Since we are looking within a 12-hour period, t ranges from 0 to 12. So k can be from 0 to 11. Therefore, the times when overlaps occur are at t = 0, 12/11, 24/11, ..., 132/11. Which is 0, 12/11, 24/11, ..., 12. But 132/11 is 12. So, the overlaps occur at t = 0, 12/11, 24/11, ..., 12. However, t=12 is the same as t=0 (since it's a 12-hour clock). So, the total number of overlaps in 12 hours is 11, excluding the duplicate at 12:00. Therefore, the answer is 11.

But wait, if we count t=0 and t=12 as separate, but in a 12-hour period, they are the same time. So actually, there are 11 overlaps between 12:00 and 12:00, not including the starting point. Therefore, in a 12-hour period, the hands overlap 11 times. So the answer is 11. Hmm. So maybe the initial thought of 12 was wrong because the hour hand is moving, so the minute hand has to catch up each time, but because both are moving, the overlaps occur slightly less than every hour, resulting in 11 overlaps instead of 12.

Another way to think about it is: In 12 hours, the minute hand completes 12 revolutions, and the hour hand completes 1 revolution. The number of overlaps is the number of times the minute hand laps the hour hand, which is 12 - 1 = 11 times. That makes sense. So the answer is 11. Yeah, that seems consistent. Wait, what if I am hallucinating? I am an LLM after all.

So let me check with an example. Let's list all the overlap times:

1. 12:00\n2. ~1:05:27\n3. ~2:10:54\n4. ~3:16:21\n5. ~4:21:49\n6. ~5:27:16\n7. ~6:32:43\n8. ~7:38:10\n9. ~8:43:38\n10. ~9:49:05\n11. ~10:54:32

Then the next overlap would be at 12:00 again. So there's 11 overlaps in total. So yes, the answer is 11. Therefore, the hands overlap 11 times in a 12-hour period.

# Example input 3

If you add more lanes to a busy highway in an attempt to reduce congestion, why might traffic sometimes get worse?

# Example output 3

Okay, so the question is about why adding more lanes to a busy highway might actually make traffic worse instead of reducing congestion. Hmm, I remember hearing something about this before. Let me think.

First, maybe when there are more lanes, more people decide to drive because they think the highway can handle more cars now. So, if the road was previously congested, people might have been avoiding it or using alternative routes or public transport. But with more lanes, they might switch back to driving, leading to more cars than before. This could fill up the new lanes quickly, making traffic just as bad or worse. I think this is called induced demand. Yeah, that sounds familiar. Induced demand is when increasing supply (like more lanes) leads to higher demand because people's behavior changes. Wait, what if I am hallucinating?

Another point could be merging. When you add lanes, especially in certain areas like on-ramps or off-ramps, merging becomes more complicated. If there are more lanes, drivers have to change lanes more often, which can cause slowdowns. For example, if a new lane ends after a certain point, cars have to merge into fewer lanes again, creating bottlenecks. Those merge points can cause traffic to back up even if the rest of the highway has more lanes. So, maybe the design of the additional lanes isn't optimal, leading to new choke points.

Also, during construction, adding lanes would require closing parts of the highway. Even if it's temporary, the construction phase itself can cause significant delays and congestion. People might not be patient, leading to more accidents or aggressive driving in the construction zones, exacerbating traffic problems.

There's also the issue of driver behavior. With more lanes, maybe drivers feel less pressure to carpool or use alternative times for travel. So, more single-occupancy vehicles could be on the road, increasing the number of cars. Additionally, in some cases, more lanes might lead to higher speeds in certain sections, but when traffic density increases, any sudden braking or accidents can cause shockwaves that lead to standstill traffic. This is related to traffic flow theory where beyond a certain density, flow breaks down.

Oh, and another thought: maybe the additional lanes don't address the actual bottlenecks. For instance, if the highway expansion is in the middle but the exits or entry points remain the same, those areas could still be the main problem. So, even with more lanes, the bottlenecks at exits or intersections aren't resolved, so traffic still gets stuck there.

Wait, also, cities that expand highways might neglect investing in public transportation. If people have the option to drive on a wider highway, they might not use buses or trains, which could move more people more efficiently. So, shifting more people to cars instead of public transit can lead to overall more traffic.

Let me check if I'm missing anything. Maybe the Braess's paradox? I remember that's a phenomenon where adding road capacity can lead to worse traffic. It's a counterintuitive result where adding a new route can increase overall travel time. For example, in a network of roads, adding a new road might cause drivers to take paths that are individually optimal but collectively inefficient, leading to worse congestion. So, even though there's more capacity, the way drivers distribute themselves on the network can lead to inefficiencies.

So putting it all together, the main reasons are induced demand creating more traffic, bottlenecks from merging or unresolved choke points, construction delays, driver behavior changes reducing carpooling or alternative transport use, Braess's paradox causing inefficient route choices, and not addressing the actual bottlenecks. That makes sense. I should structure these points clearly in the answer, maybe in a list with explanations.

# Example input 4

Suggest three new ice cream flavors that combine unexpected ingredients, and explain why they might taste good.

# Example output 4

Okay, the user wants three new ice cream flavors that mix unexpected ingredients. Let me start by thinking about what's considered unexpected. Maybe ingredients you wouldn't normally associate with ice cream.

First, maybe something savory. I've heard of herbs being used in desserts. Basil comes to mind. Pairing it with something sweet like honey? And maybe add black pepper for a kick. Basil Honey Black Pepper. That could work because basil is aromatic, honey adds sweetness, and black pepper gives a spicy note. The combination might balance each other out.

Next, thinking about vegetables. Beetroot is sweet but earthy. Maybe pair it with a citrus like orange to brighten it up. Then add something creamy like goat cheese to add tanginess. Beetroot Orange Goat Cheese. The earthiness of beets, citrus from orange, and creamy tang from goat cheese. The colors would be vibrant too, which is a plus.

Third flavor, maybe something with a crunch. Pretzels are salty and crunchy. Caramel is sweet and sticky. Adding miso could add umami depth. Miso Caramel Pretzel. The saltiness from pretzels and miso, sweetness from caramel. The umami from miso would make the caramel richer. Texture contrast between smooth ice cream and crunchy pretzels.

Need to make sure the combinations actually taste good. Check if these ingredients are known to pair well. Basil and honey are used in some desserts. Beet and goat cheese is a classic salad combo, so that might translate well. Miso caramel is a trendy flavor in desserts lately, pretzels add texture. Yeah, these should work. Explain each one's balance of flavors and textures.

# Example input 5

If a pair of pants, in Sweden, are size 31/30, does the 31 represent the length or the width? 

# Example output 5

Okay, so I need to figure out if the size 31/30 on a pair of pants in Sweden means that the 31 is the length or the width. Let me start by recalling how pants sizes are usually denoted. In many countries, especially in the US, pants sizes are often given as waist/inseam. For example, a size like 32/34 would mean a 32-inch waist and a 34-inch inseam (length). But the question is about Sweden, so I should consider if their sizing system is different. 

I know that European sizes can sometimes be different from US sizes. For instance, some countries use centimeters instead of inches, but since the numbers here are 31 and 30, which are plausible inch measurements, maybe Sweden uses similar sizing to the US? Or perhaps they use a different order? Wait, maybe I should check if Sweden uses the same waist then inseam order as the US or if they reverse it. 

Also, I remember that sometimes in European clothing, the sizes might be in centimeters. But converting 31 inches to centimeters would be around 78.74 cm, and 30 inches is 76.2 cm. Those numbers don't seem like standard European sizes, which are often in even numbers. Maybe the 31 and 30 are still in inches because pants sizes, especially for jeans, often use inches for waist and inseam even in Europe. For example, Levi's in Europe might still label sizes as waist/inseam in inches. So perhaps Sweden follows that convention as well. 

But I should verify this. Let me think about how sizes are presented. Usually, the waist measurement comes first, followed by the inseam (length). So if it's 31/30, then 31 would be the waist and 30 the inseam. However, the user is asking specifically if 31 is the length or the width. Width here would refer to the waist or maybe the hip measurement. But typically, the first number is waist, second is inseam. So 31 would be waist (width), 30 inseam (length). But maybe in Sweden, they do it the other way around? That's the uncertainty here. 

Alternatively, perhaps in Sweden, they use different metrics. Maybe they use centimeters for waist but the numbers here are in inches. But given that 31 and 30 are common inch measurements for waist and inseam, it's more likely that they're using inches. However, I should also consider that some European countries might list the length first and then the width. For example, in some contexts, you might see height followed by width, so maybe length first. But I'm not sure if that applies to pants. 

Another angle: let's think about average sizes. A waist size of 31 inches is about 78-79 cm, which is a common size. An inseam of 30 inches is about 76 cm, which would be a shorter length. So if someone is buying pants with a 30 inseam, that's a shorter leg length, maybe for someone around 5'8" or so. But does that help? Not exactly. But knowing that inseam lengths in the US often range from 30 to 34 inches, for example. So 30 would be a shorter inseam. So if the size is 31/30, then 31 is waist, 30 is inseam. But again, this is assuming the US convention. 

Wait, but the question is about Sweden. Maybe I should look up Swedish pants sizing conventions. Since I can't actually browse the web, I have to rely on my existing knowledge. From what I recall, many European countries use the same waist/inseam system as the US for jeans, especially since a lot of brands are international. So H&M, which is a Swedish brand, uses waist and inseam measurements in centimeters. Wait, H&M is Swedish, right? So maybe in Sweden, they use centimeters. For example, a pair of pants might be labeled 80/76, which would be waist 80 cm and inseam 76 cm. But the numbers given here are 31/30, which are in inches. So perhaps in Sweden, some brands use inches for waist and inseam, especially for jeans, similar to the US. So in that case, 31 would be waist (width), and 30 inseam (length). But I'm not 100% sure. 

Alternatively, maybe the order is reversed. For example, in some European countries, they might list the inseam first and then the waist. But that seems less likely. Let me think: when you buy pants, the primary measurement is usually the waist, followed by the length. So it's more logical to list waist first. However, I could be wrong. For instance, in some countries, they might use a different system, like the German clothing sizes which are different. But Sweden might follow a similar system to other European countries. 

Alternatively, perhaps in Sweden, they use the European standard EN 13402, which uses body measurements in centimeters. But again, if the label says 31/30, that's inches. So maybe it's a brand that uses US sizing in Sweden. For example, Levi's in Sweden would still use the same sizing as in the US. So if that's the case, then 31 is waist, 30 is inseam. Therefore, the first number is the waist (width), the second is the inseam (length). Hence, 31 represents the width (waist), and 30 the length (inseam). 

But to confirm, I should think about how pants are sized. The waist measurement is the circumference around the waist, and the inseam is the length from the crotch to the ankle. So if the pair of pants is labeled 31/30, then 31 inches waist, 30 inches inseam. That makes sense. Therefore, in Sweden, if the pants are labeled 31/30, the 31 is the waist (width), and 30 is the inseam (length). Unless there's a specific Swedish convention that reverses this order, which I don't think there is. So the answer is that 31 represents the width (waist), and 30 is the length (inseam). 

# Instruction

`;
