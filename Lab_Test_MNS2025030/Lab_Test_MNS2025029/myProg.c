#include <stdint.h>
#include <emscripten/emscripten.h>

EMSCRIPTEN_KEEPALIVE
long long modexp(long long base, long long exp, long long mod) {
    if (mod == 1) return 0;
    long long result = 1 % mod;
    long long b = base % mod;
    if (b < 0) b += mod;
    while (exp > 0) {
        if (exp & 1) {
            __int128 tmp = (__int128)result * (__int128)b;
            result = (long long)(tmp % mod);
        }
        __int128 tmp2 = (__int128)b * (__int128)b;
        b = (long long)(tmp2 % mod);
        exp >>= 1;
    }
    return result;
}
