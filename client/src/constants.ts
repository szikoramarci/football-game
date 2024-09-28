export const PITCH_LENGTH = 37; // ORIGINAL: 37
export const PITCH_WIDTH = Math.round(PITCH_LENGTH * 0.67567567567); // ORIGINAL: 25 

export const HEXA_RADIUS = 60;
export const HEXA_WIDTH = HEXA_RADIUS * 0.86602540378 * 2;

export const PLAYER_TOKEN_RADIUS = HEXA_RADIUS * 0.7;
export const PLAYER_KIT_FONT_SIZE = HEXA_RADIUS * 0.9;

export const BALL_TOKEN_RADIUS = HEXA_RADIUS * 0.5;

export const HEADER_HEX_DISTANCE = Math.round(PITCH_LENGTH * 0.16216216216); // ORIGINAL: 6
export const HEADER_PIXEL_DISTANCE = HEXA_WIDTH * (HEADER_HEX_DISTANCE - 0.5);

export const FIRST_TIME_PASS_HEX_DISTANCE = Math.round(PITCH_LENGTH * 0.16216216216); // ORIGINAL: 6
export const FIRST_TIME_PASS_PIXEL_DISTANCE = HEXA_WIDTH * (FIRST_TIME_PASS_HEX_DISTANCE - 0.5);

export const STANDARD_PASS_HEX_DISTANCE = Math.round(PITCH_LENGTH * 0.32432432432); // ORIGINAL: 12
export const STANDARD_PASS_PIXEL_DISTANCE = HEXA_WIDTH * (STANDARD_PASS_HEX_DISTANCE - 0.5); // FROM HEX CENTER TO HEX CENTER

export const SHOOT_HEX_DISTANCE = Math.round(PITCH_LENGTH * 0.32432432432); // ORIGINAL: 12
export const SHOOT_PIXEL_DISTANCE = HEXA_WIDTH * (SHOOT_HEX_DISTANCE - 0.5);

export const HIGH_PASS_HEX_DISTANCE = Math.round(PITCH_LENGTH * 0.4054054054); // ORIGINAL: 15
export const HIGH_PASS_PIXEL_DISTANCE = HEXA_WIDTH * (HIGH_PASS_HEX_DISTANCE - 0.5);
