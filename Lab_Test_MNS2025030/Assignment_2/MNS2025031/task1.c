// list_algos.c
#include <stdio.h>
#include <oqs/oqs.h>

int main(void) {
    int kem_count = OQS_KEM_alg_count();
    printf("KEM algorithms available in this build: %d\n", kem_count);
    for (int i = 0; i < kem_count; i++) {
        const char *id = OQS_KEM_alg_identifier(i);
        int enabled = OQS_KEM_alg_is_enabled(id);
        printf("  %2d: %s  (enabled=%d)\n", i, id, enabled);
    }

    int sig_count = OQS_SIG_alg_count();
    printf("\nSIG algorithms available in this build: %d\n", sig_count);
    for (int i = 0; i < sig_count; i++) {
        const char *id = OQS_SIG_alg_identifier(i);
        int enabled = OQS_SIG_alg_is_enabled(id);
        printf("  %2d: %s  (enabled=%d)\n", i, id, enabled);
    }
    return 0;
}
