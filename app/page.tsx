import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, RefreshCw, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

export default function Dashboard() {
  type LoanStatus = "active" | "overdue" | "returned";
  interface Loan {
    id: number;
    bookTitle: string;
    userName: string;
    dueDate: string;
    status: LoanStatus;
  }

  const stats = [
    { title: "Total de Livros", value: 100, icon: BookOpen, description: "100 disponíveis", color: "text-primary" },
    { title: "Usuários Ativos", value: 65, icon: Users, description: "Cadastrados no sistema", color: "text-library-secondary" },
    { title: "Empréstimos Ativos", value: 76, icon: RefreshCw, description: "Em andamento", color: "text-library-accent" },
    { title: "Livros em Atraso", value: 22, icon: AlertTriangle, description: "Necessitam atenção", color: "text-library-error" }
  ];

  const mockLoans: Loan[] = [
    { id: 1, bookTitle: "Dom Casmurro", userName: "Maria Silva", dueDate: "2025-09-20", status: "active" },
    { id: 2, bookTitle: "Clean Code", userName: "João Santos", dueDate: "2025-09-15", status: "overdue" },
    { id: 3, bookTitle: "O Pequeno Príncipe", userName: "Ana Souza", dueDate: "2025-09-10", status: "returned" }
  ];

  const recentLoans = mockLoans.slice(0, 3);

  return (
    <div className="flex flex-col w-full min-h-screen p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de biblioteca</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-foreground">{loan.bookTitle}</p>
                    <p className="text-sm text-muted-foreground">Emprestado para {loan.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      Vence em: {new Date(loan.dueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      loan.status === "active"
                        ? "bg-library-secondary text-secondary-foreground"
                        : loan.status === "overdue"
                        ? "bg-library-error text-white"
                        : "bg-library-success text-white"
                    }`}
                  >
                    {loan.status === "active" ? "Ativo" : loan.status === "overdue" ? "Atrasado" : "Devolvido"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Categorias Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Literatura Brasileira", count: 2, percentage: 40 },
                { name: "Tecnologia", count: 1, percentage: 20 },
                { name: "Ciência da Computação", count: 1, percentage: 20 },
                { name: "História", count: 1, percentage: 20 }
              ].map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                    <span className="text-sm text-muted-foreground">{category.count} livros</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
