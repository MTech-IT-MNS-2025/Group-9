
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <oqs/oqs.h>

int main(void) {
    const char *alg_name = "Dilithium2"; // Use plain string instead of macro

    if (!OQS_SIG_alg_is_enabled(alg_name)) {
        printf("Algorithm %s not enabled in liboqs build.\n", alg_name);
        return EXIT_FAILURE;
    }

    printf("Using algorithm: %s\n", alg_name);

    OQS_SIG *sig = OQS_SIG_new(alg_name);
    if (sig == NULL) {
        printf("Failed to create signature object.\n");
        return EXIT_FAILURE;
    }

    // Allocate buffers
    uint8_t *public_key = malloc(sig->length_public_key);
    uint8_t *secret_key = malloc(sig->length_secret_key);
    uint8_t *signature = malloc(sig->length_signature);

    if (!public_key || !secret_key || !signature) {
        printf("Memory allocation failed.\n");
        OQS_SIG_free(sig);
        return EXIT_FAILURE;
    }

    // Step 1: Generate key pair
    if (OQS_SIG_keypair(sig, public_key, secret_key) != OQS_SUCCESS) {
        printf("Key generation failed!\n");
        OQS_SIG_free(sig);
        return EXIT_FAILURE;
    }
    printf("✅ Step 1: Key pair generated successfully.\n");

    const char *message = "Testing Dilithium2 Post-Quantum Digital Signature.";
    size_t message_len = strlen(message);
    size_t signature_len = 0;

    // Step 2: Sign message
    if (OQS_SIG_sign(sig, signature, &signature_len,
                     (const uint8_t *)message, message_len, secret_key) != OQS_SUCCESS) {
        printf("Signing failed!\n");
        OQS_SIG_free(sig);
        return EXIT_FAILURE;
    }
    printf("✅ Step 2: Message signed successfully.\n");

    // Step 3: Verify signature
    OQS_STATUS result = OQS_SIG_verify(sig,
                                       (const uint8_t *)message, message_len,
                                       signature, signature_len,
                                       public_key);

    if (result == OQS_SUCCESS)
        printf("🎉 Step 3: Signature verification SUCCESS.\n");
    else
        printf("❌ Step 3: Signature verification FAILED.\n");

    // Cleanup
    OQS_MEM_secure_free(secret_key, sig->length_secret_key);
    free(public_key);
    free(signature);
    OQS_SIG_free(sig);

    printf("All resources cleaned up.\n");
    return EXIT_SUCCESS;
}

