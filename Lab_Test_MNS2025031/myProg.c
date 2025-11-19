// myProg.c
int modexp(int g, int a, int p) {
    long long result = 1;
    long long base = g % p;

    while (a > 0) {
        if (a & 1) result = (result * base) % p;
        base = (base * base) % p;
        a >>= 1;
    }
    return (int)result;
}

