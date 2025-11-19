#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

long long modexp(long long base, long long exp, long long mod) {
    if (mod == 1) return 0;
    long long result = 1 % mod;
    long long b = base % mod;
    if (b < 0) b += mod;
    while (exp > 0) {
        if (exp & 1) {
            __int128 tmp = (__int128)result * b;
            result = (long long)(tmp % mod);
        }
        __int128 tmp2 = (__int128)b * b;
        b = (long long)(tmp2 % mod);
        exp >>= 1;
    }
    return result;
}

int main(int argc, char **argv) {
    if (argc < 4) {
        fprintf(stderr, "usage: %s <base> <exp> <mod>\n", argv[0]);
        return 2;
    }

    long long base = atoll(argv[1]);
    long long exp  = atoll(argv[2]);
    long long mod  = atoll(argv[3]);

    printf("%lld\n", modexp(base, exp, mod));
    return 0;
}
