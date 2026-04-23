-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('EMAIL_VERIFICATION', 'EMAIL_RESET', 'PASSWORD_RESET', 'STATE_42AUTH', 'STATE_42LINK');

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "login" TEXT,
    "display_name" TEXT,
    "internal_note" TEXT,
    "join_date" TIMESTAMP(3),
    "email_validated" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "purpose" "TokenPurpose" NOT NULL,
    "member_id" INTEGER,
    "data" JSONB,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adhesion" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adhesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "super_role" BOOLEAN NOT NULL DEFAULT false,
    "default_role" BOOLEAN NOT NULL DEFAULT false,
    "display_color" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_roles" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "member_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "manager" INTEGER NOT NULL,
    "discord_message_id" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_members" (
    "id" SERIAL NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "position_id" INTEGER,

    CONSTRAINT "shift_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_positions" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "xp_mult" DOUBLE PRECISION DEFAULT 1,

    CONSTRAINT "shift_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_assignment" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "member_id" INTEGER,

    CONSTRAINT "shift_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "order_index" INTEGER,

    CONSTRAINT "stock_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_item" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "category_id" INTEGER,
    "expected_quantity" INTEGER,
    "missing_quantity" INTEGER,
    "unit" TEXT,
    "is_active" BOOLEAN,

    CONSTRAINT "stock_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "registration_doc_url" TEXT,
    "fiscal_power" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_trip" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "trip_date" TIMESTAMP(3) NOT NULL,
    "distance_km" INTEGER NOT NULL,
    "purpose" TEXT,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),

    CONSTRAINT "expense_trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battlepass_seasons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battlepass_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battlepass_tiers" (
    "id" SERIAL NOT NULL,
    "season_id" INTEGER NOT NULL,
    "tier_number" INTEGER NOT NULL,
    "requirement" INTEGER NOT NULL,
    "reward" TEXT NOT NULL,

    CONSTRAINT "battlepass_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_battlepass_rewards" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "tier_id" INTEGER NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_battlepass_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_config" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_config_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_login_key" ON "members"("login");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_member_id_refresh_token_key" ON "sessions"("member_id", "refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_key" ON "role_permissions"("role_id", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "member_roles_member_id_role_id_key" ON "member_roles"("member_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "shift_positions_position_key" ON "shift_positions"("position");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adhesion" ADD CONSTRAINT "adhesion_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_roles" ADD CONSTRAINT "member_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_manager_fkey" FOREIGN KEY ("manager") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_members" ADD CONSTRAINT "shift_members_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_members" ADD CONSTRAINT "shift_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_members" ADD CONSTRAINT "shift_members_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "shift_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_assignment" ADD CONSTRAINT "shift_assignment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "stock_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_trip" ADD CONSTRAINT "expense_trip_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_trip" ADD CONSTRAINT "expense_trip_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battlepass_tiers" ADD CONSTRAINT "battlepass_tiers_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "battlepass_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_battlepass_rewards" ADD CONSTRAINT "member_battlepass_rewards_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_battlepass_rewards" ADD CONSTRAINT "member_battlepass_rewards_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "battlepass_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_battlepass_rewards" ADD CONSTRAINT "member_battlepass_rewards_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "battlepass_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
