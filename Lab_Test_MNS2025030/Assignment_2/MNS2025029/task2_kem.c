#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <oqs/oqs.h>

static double diff_ms(const struct timespec *a, const struct timespec *b) {
    return (double)(b->tv_sec - a->tv_sec) * 1000.0 + (double)(b->tv_nsec - a->tv_nsec) / 1.0e6;
}

int main(int argc, char **argv) {
    int i;
    int kem_count = OQS_KEM_alg_count();
    printf("KEM algorithms known to liboqs (total %d):\n", kem_count);
    for (i = 0; i < kem_count; ++i) {
        const char *id = OQS_KEM_alg_identifier(i);
        int enabled = OQS_KEM_alg_is_enabled(id);
        printf("  [%2d] %s  : %s\n", i, id, enabled ? "ENABLED" : "disabled");
    }

    const char *alg = NULL;
    if (argc >= 2) {
        alg = argv[1];
        printf("\nRequested algorithm: %s\n", alg);
    } else {
        for (i = 0; i < kem_count; ++i) {
            const char *id = OQS_KEM_alg_identifier(i);
            if (OQS_KEM_alg_is_enabled(id)) { alg = id; break; }
        }
        if (alg != NULL) printf("\nNo algorithm argument given. Selecting first enabled algorithm: %s\n", alg);
    }

    if (alg == NULL) {
        fprintf(stderr, "No enabled KEM algorithm found in this liboqs build.\n");
        return EXIT_FAILURE;
    }

    if (!OQS_KEM_alg_is_enabled(alg)) {
        fprintf(stderr, "Algorithm '%s' is not enabled in this liboqs build.\n", alg);
        return EXIT_FAILURE;
    }

    OQS_KEM *kem = OQS_KEM_new(alg);
    if (!kem) {
        fprintf(stderr, "OQS_KEM_new failed for algorithm %s\n", alg);
        return EXIT_FAILURE;
    }

    printf("\nUsing KEM: %s\n", kem->method_name);
    printf("  public_key length:   %zu\n", kem->length_public_key);
    printf("  secret_key length:   %zu\n", kem->length_secret_key);
    printf("  ciphertext length:   %zu\n", kem->length_ciphertext);
    printf("  shared_secret length:%zu\n\n", kem->length_shared_secret);

    uint8_t *public_key = malloc(kem->length_public_key);
    uint8_t *secret_key = malloc(kem->length_secret_key);
    uint8_t *ciphertext = malloc(kem->length_ciphertext);
    uint8_t *ss_enc = malloc(kem->length_shared_secret);
    uint8_t *ss_dec = malloc(kem->length_shared_secret);

    if (!public_key || !secret_key || !ciphertext || !ss_enc || !ss_dec) {
        fprintf(stderr, "Memory allocation failed\n");
        OQS_KEM_free(kem);
        return EXIT_FAILURE;
    }

    struct timespec t0, t1;
    double keygen_ms = 0.0, encap_ms = 0.0, decap_ms = 0.0;

    clock_gettime(CLOCK_MONOTONIC, &t0);
    if (OQS_KEM_keypair(kem, public_key, secret_key) != OQS_SUCCESS) {
        fprintf(stderr, "OQS_KEM_keypair failed\n");
        goto cleanup;
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    keygen_ms = diff_ms(&t0, &t1);
    printf("Key generation: %.3f ms\n", keygen_ms);

    clock_gettime(CLOCK_MONOTONIC, &t0);
    if (OQS_KEM_encaps(kem, ciphertext, ss_enc, public_key) != OQS_SUCCESS) {
        fprintf(stderr, "OQS_KEM_encaps failed\n");
        goto cleanup;
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    encap_ms = diff_ms(&t0, &t1);
    printf("Encapsulation: %.3f ms\n", encap_ms);

    clock_gettime(CLOCK_MONOTONIC, &t0);
    if (OQS_KEM_decaps(kem, ss_dec, ciphertext, secret_key) != OQS_SUCCESS) {
        fprintf(stderr, "OQS_KEM_decaps failed\n");
        goto cleanup;
    }
    clock_gettime(CLOCK_MONOTONIC, &t1);
    decap_ms = diff_ms(&t0, &t1);
    printf("Decapsulation: %.3f ms\n", decap_ms);

    if (memcmp(ss_enc, ss_dec, kem->length_shared_secret) == 0) {
        printf("\nResult: Shared secrets MATCH\n");
    } else {
        printf("\nResult: Shared secrets DO NOT match\n");
    }

    printf("\nSummary:\n");
    printf("  keygen  = %.3f ms\n", keygen_ms);
    printf("  encap   = %.3f ms\n", encap_ms);
    printf("  decap   = %.3f ms\n", decap_ms);

cleanup:
    if (secret_key) OQS_MEM_secure_free(secret_key, kem->length_secret_key);
    free(public_key);
    free(ciphertext);
    free(ss_enc);
    free(ss_dec);
    OQS_KEM_free(kem);
    return EXIT_SUCCESS;
}
