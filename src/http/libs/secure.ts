export function hashPassword(password: string) {
    return Bun.password.hashSync(password, {
      algorithm: "bcrypt",
      cost: 10,
    })
}

export function isPasswordValid(password: string, hash: string) {
    return Bun.password.verifySync(password, hash);
}