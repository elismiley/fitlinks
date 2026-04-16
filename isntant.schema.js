import { i } from "@instantdb/react";

const schema = i.schema({
entities: {
users: i.entity({
email: i.string().unique().indexed(),
name: i.string(),
index: i.number(),
roundsPlayed: i.number(),
createdAt: i.number(),
}),
rounds: i.entity({
userId: i.string().indexed(),
courseKey: i.string(),
courseName: i.string(),
finalScore: i.number(),
movementAvg: i.number(),
restTime: i.number(),
restModifier: i.number(),
upperStrength: i.number(),
lowerStrength: i.number(),
core: i.number(),
cardio: i.number(),
holeTimes: i.json(),
playedAt: i.number(),
}),
},
});

export default schema;
