#include <stdint.h>
#include <string.h>
#include <stdlib.h>

uint8_t S[256];

void rc4_init(const uint8_t *key, int key_len) {
    for (int i = 0; i < 256; i++)
        S[i] = i;

    int j = 0;
    for (int i = 0; i < 256; i++) {
        j = (j + S[i] + key[i % key_len]) % 256;
        uint8_t temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }
}

void rc4_crypt(const uint8_t *input, uint8_t *output, int len) {
    int i = 0, j = 0;

    for (int k = 0; k < len; k++) {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;

        uint8_t temp = S[i];
        S[i] = S[j];
        S[j] = temp;

        uint8_t rnd = S[(S[i] + S[j]) % 256];
        output[k] = input[k] ^ rnd;
    }
}

int encrypt(uint8_t *text, int text_len, uint8_t *key, int key_len, uint8_t *output) {
    rc4_init(key, key_len);
    rc4_crypt(text, output, text_len);
    return text_len;
}

int decrypt(uint8_t *text, int text_len, uint8_t *key, int key_len, uint8_t *output) {
    rc4_init(key, key_len);
    rc4_crypt(text, output, text_len);
    return text_len;
}
