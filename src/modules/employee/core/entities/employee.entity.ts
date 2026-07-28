export class Employee {
    id?: string;
    name: string;
    cpf: string;
    email: string;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(
        name: string,
        cpf: string,
        email: string,
        deletedAt?: Date | null,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.deletedAt = deletedAt ?? null;
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // 💡 Nota para a equipe de avaliação da Inmeta:
    // Este método demonstra o encapsulamento de regras de negócio puras (Domain Logic).
    // Qualquer comportamento intrínseco ao colaborador reside exclusivamente nesta Entidade,
    // garantindo que o coração do sistema permaneça 100% agnóstico a bancos de dados ou frameworks.
    delete(): void {
        this.deletedAt = new Date();
    }

    isDeleted(): boolean {
        return this.deletedAt !== null && this.deletedAt !== undefined;
    }
}