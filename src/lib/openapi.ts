export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Souki API",
    version: "0.1.0",
    description: `API de la plateforme Souki — gestion de souks automobiles algériens.

## Rôles
- **Organisateur** : crée et gère les souks
- **Vendeur** : inscrit ses véhicules dans les souks
- **Visiteur** : consulte et enchérit sur les véhicules

> ⚠ L'authentification n'est pas encore implémentée — les IDs utilisateurs sont codés en dur.`,
  },
  servers: [
    { url: "http://localhost:3000", description: "Développement local" },
  ],
  paths: {
    "/api/souks": {
      get: {
        tags: ["Souks"],
        summary: "Liste des souks",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string" },
            description: "Filtre par statut (séparé par des virgules). Ex: ?status=pending,active",
            required: false,
          },
        ],
        responses: {
          "200": {
            description: "Liste des souks",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Souk" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Souks"],
        summary: "Créer un souk",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateSoukInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Souk créé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Souk" },
              },
            },
          },
          "400": {
            description: "Champs obligatoires manquants",
          },
        },
      },
    },
    "/api/souks/{id}/register": {
      post: {
        tags: ["Souks"],
        summary: "Inscrire un vendeur à un souk",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID du souk",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  sellerId: {
                    type: "string",
                    description: "ID du vendeur (optionnel, défaut: default-seller)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Inscription créée",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SoukRegistration" },
              },
            },
          },
          "400": {
            description: "Déjà inscrit ou plus de places",
          },
          "404": {
            description: "Souk introuvable",
          },
        },
      },
      patch: {
        tags: ["Souks"],
        summary: "Mettre à jour une inscription (statut / place)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID du souk",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["registrationId", "action"],
                properties: {
                  registrationId: { type: "string" },
                  action: {
                    type: "string",
                    enum: ["accepted", "rejected", "present"],
                  },
                  spotNumber: {
                    type: "integer",
                    description: "Requis si action=present",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Inscription mise à jour",
          },
        },
      },
    },
    "/api/souks/{id}/vehicles": {
      get: {
        tags: ["Véhicules"],
        summary: "Liste des véhicules dans un souk (prix caché pour les visiteurs)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID du souk",
          },
        ],
        responses: {
          "200": {
            description: "Liste des véhicules (sans prix pour les visiteurs)",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/VehicleSafe" },
                },
              },
            },
          },
        },
      },
    },
    "/api/vehicles": {
      post: {
        tags: ["Véhicules"],
        summary: "Ajouter un véhicule à un souk",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateVehicleInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Véhicule créé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Vehicle" },
              },
            },
          },
          "400": {
            description: "Champs obligatoires manquants ou aucun vendeur trouvé",
          },
        },
      },
    },
    "/api/vehicles/{id}": {
      get: {
        tags: ["Véhicules"],
        summary: "Détails d'un véhicule (avec infos vendeur)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Détails du véhicule",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VehicleDetail" },
              },
            },
          },
          "404": {
            description: "Véhicule introuvable",
          },
        },
      },
      patch: {
        tags: ["Véhicules"],
        summary: "Mettre à jour un véhicule",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                description: "Champs partiels du véhicule à mettre à jour",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Véhicule mis à jour",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Vehicle" },
              },
            },
          },
        },
      },
    },
    "/api/bids": {
      get: {
        tags: ["Enchères"],
        summary: "Liste des enchères",
        parameters: [
          {
            name: "vehicleId",
            in: "query",
            schema: { type: "string" },
            description: "Filtre par véhicule",
            required: false,
          },
        ],
        responses: {
          "200": {
            description: "Liste des enchères",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Bid" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Enchères"],
        summary: "Placer une enchère",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["vehicleId", "amount"],
                properties: {
                  vehicleId: { type: "string" },
                  amount: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Enchère créée",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Bid" },
              },
            },
          },
          "400": {
            description: "Champs obligatoires manquants",
          },
        },
      },
    },
    "/api/bids/{id}": {
      patch: {
        tags: ["Enchères"],
        summary: "Mettre à jour le statut d'une enchère",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["active", "outbid", "won", "lost"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Enchère mise à jour",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Bid" },
              },
            },
          },
        },
      },
    },
    "/api/organizer/souks/{id}/status": {
      patch: {
        tags: ["Organisateur"],
        summary: "Changer le statut d'un souk",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["pending", "active", "completed", "cancelled"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Statut mis à jour",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Souk" },
              },
            },
          },
          "400": {
            description: "Statut invalide",
          },
        },
      },
    },
    "/api/qrcode/generate": {
      post: {
        tags: ["QR Code"],
        summary: "Générer un QR code à partir de données arbitraires",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["data"],
                properties: {
                  data: {
                    type: "string",
                    description: "Données à encoder dans le QR code",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "QR code généré (data URL base64)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    qrCode: {
                      type: "string",
                      description: "Data URL de l'image QR code",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Données requises",
          },
        },
      },
    },
    "/api/qrcode/scan": {
      post: {
        tags: ["QR Code"],
        summary: "Scanner et traiter un QR code",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["qrData"],
                properties: {
                  qrData: {
                    type: "string",
                    description: "Contenu du QR code (brut ou JSON)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Données décodées selon le type de QR",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/QRScanSoukAccess" },
                    { $ref: "#/components/schemas/QRScanVehicleInfo" },
                  ],
                },
              },
            },
          },
          "404": {
            description: "Inscription ou véhicule introuvable",
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Authentification"],
        summary: "Créer un compte",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "name", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  name: { type: "string" },
                  password: { type: "string", minLength: 6 },
                  role: { type: "string", enum: ["visitor", "organizer", "seller"], description: "Défaut: visitor" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Compte créé (cookie HTTP-Only set)" },
          "400": { description: "Champs obligatoires manquants" },
          "409": { description: "Email déjà utilisé" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentification"],
        summary: "Se connecter",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Connecté (cookie HTTP-Only set)" },
          "400": { description: "Email et mot de passe requis" },
          "401": { description: "Email ou mot de passe incorrect" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Authentification"],
        summary: "Récupérer l'utilisateur connecté",
        responses: {
          "200": { description: "Utilisateur connecté" },
          "401": { description: "Non connecté" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Authentification"],
        summary: "Se déconnecter",
        responses: {
          "200": { description: "Cookie supprimé" },
        },
      },
    },
  },
  components: {
    schemas: {
      Souk: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          location: { type: "string" },
          date: { type: "string", format: "date-time" },
          startTime: { type: "string", example: "09:00" },
          endTime: { type: "string", nullable: true, example: "18:00" },
          spots: { type: "integer" },
          spotPrice: { type: "number" },
          services: { type: "string", nullable: true },
          status: { type: "string", enum: ["pending", "active", "completed", "cancelled"] },
          organizerId: { type: "string" },
          organizer: {
            type: "object",
            properties: { name: { type: "string" } },
          },
          _count: {
            type: "object",
            properties: {
              vehicles: { type: "integer" },
              registrations: { type: "integer" },
            },
          },
        },
      },
      CreateSoukInput: {
        type: "object",
        required: ["title", "location", "date", "startTime", "spots", "spotPrice"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          location: { type: "string" },
          date: { type: "string", format: "date-time" },
          startTime: { type: "string", example: "09:00" },
          endTime: { type: "string", example: "18:00" },
          spots: { type: "integer" },
          spotPrice: { type: "number" },
          services: { type: "string" },
        },
      },
      SoukRegistration: {
        type: "object",
        properties: {
          id: { type: "string" },
          soukId: { type: "string" },
          sellerId: { type: "string" },
          spotNumber: { type: "integer", nullable: true },
          qrCode: { type: "string" },
          status: { type: "string", enum: ["pending", "accepted", "rejected", "present"] },
        },
      },
      Vehicle: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          brand: { type: "string" },
          model: { type: "string" },
          year: { type: "integer", nullable: true },
          mileage: { type: "integer", nullable: true },
          fuelType: { type: "string", nullable: true, enum: ["essence", "diesel", "électrique", "hybride"] },
          description: { type: "string", nullable: true },
          price: { type: "number", nullable: true },
          priceType: { type: "string", enum: ["fixed", "negotiable"] },
          images: { type: "string", nullable: true },
          qrCode: { type: "string", nullable: true },
          status: { type: "string", enum: ["pending", "assigned", "sold"] },
          soukId: { type: "string" },
          sellerId: { type: "string" },
        },
      },
      VehicleSafe: {
        type: "object",
        description: "Véhicule sans prix (pour visiteurs)",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          brand: { type: "string" },
          model: { type: "string" },
          year: { type: "integer", nullable: true },
          mileage: { type: "integer", nullable: true },
          fuelType: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          priceType: { type: "string" },
          seller: {
            type: "object",
            properties: { name: { type: "string" } },
          },
          hasPrice: { type: "boolean" },
        },
      },
      VehicleDetail: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          brand: { type: "string" },
          model: { type: "string" },
          year: { type: "integer", nullable: true },
          mileage: { type: "integer", nullable: true },
          fuelType: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          price: { type: "number", nullable: true },
          priceType: { type: "string" },
          status: { type: "string" },
          seller: {
            type: "object",
            properties: {
              name: { type: "string" },
              phone: { type: "string" },
            },
          },
        },
      },
      CreateVehicleInput: {
        type: "object",
        required: ["title", "brand", "model", "soukId"],
        properties: {
          title: { type: "string" },
          brand: { type: "string" },
          model: { type: "string" },
          year: { type: "integer" },
          mileage: { type: "integer" },
          fuelType: { type: "string", enum: ["essence", "diesel", "électrique", "hybride"] },
          description: { type: "string" },
          price: { type: "number" },
          priceType: { type: "string", enum: ["fixed", "negotiable"] },
          soukId: { type: "string" },
        },
      },
      Bid: {
        type: "object",
        properties: {
          id: { type: "string" },
          amount: { type: "number" },
          vehicleId: { type: "string" },
          visitorId: { type: "string" },
          status: { type: "string", enum: ["active", "outbid", "won", "lost"] },
          visitor: {
            type: "object",
            properties: { name: { type: "string" } },
          },
        },
      },
      QRScanSoukAccess: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["souk-access"] },
          registration: {
            type: "object",
            properties: {
              id: { type: "string" },
              sellerName: { type: "string" },
              soukTitle: { type: "string" },
              status: { type: "string" },
            },
          },
        },
      },
      QRScanVehicleInfo: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["vehicle-info"] },
          vehicle: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              brand: { type: "string" },
              model: { type: "string" },
              year: { type: "integer", nullable: true },
              mileage: { type: "integer", nullable: true },
              fuelType: { type: "string", nullable: true },
              description: { type: "string", nullable: true },
              price: { type: "number", nullable: true },
              priceType: { type: "string" },
              seller: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
