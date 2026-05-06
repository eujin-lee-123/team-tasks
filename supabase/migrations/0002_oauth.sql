-- 0002_oauth.sql
-- auth.users 기반 assignee_id / created_by 컬럼 추가 및 RLS 정식화

-- ────────────────────────────────────────────────────────────
-- 1. assignee_id: text → uuid FK (auth.users 참조, 미배정 허용)
-- ────────────────────────────────────────────────────────────
ALTER TABLE tasks DROP COLUMN assignee_id;

ALTER TABLE tasks
  ADD COLUMN assignee_id uuid
    REFERENCES auth.users(id) ON DELETE SET NULL;

-- ────────────────────────────────────────────────────────────
-- 2. created_by: uuid FK 추가 (우선 nullable로, 이후 강화)
-- ────────────────────────────────────────────────────────────
ALTER TABLE tasks
  ADD COLUMN created_by uuid
    REFERENCES auth.users(id) ON DELETE CASCADE;

-- ────────────────────────────────────────────────────────────
-- 3. 인증 없이 생성된 기존 row 제거 후 NOT NULL 강화
-- ────────────────────────────────────────────────────────────
DELETE FROM tasks WHERE created_by IS NULL;

ALTER TABLE tasks
  ALTER COLUMN created_by SET NOT NULL;

-- ────────────────────────────────────────────────────────────
-- 4. 임시 전체 허용 정책 제거
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "allow_all_anon"  ON tasks;
DROP POLICY IF EXISTS "temp_all_access" ON tasks;

-- ────────────────────────────────────────────────────────────
-- 5. 정식 RLS 정책 4종
-- ────────────────────────────────────────────────────────────

-- 조회: 내가 만들었거나 나에게 배정된 일감
CREATE POLICY tasks_select ON tasks
  FOR SELECT
  TO authenticated
  USING (
    created_by  = auth.uid()
    OR assignee_id = auth.uid()
  );

-- 생성: created_by 가 반드시 본인
CREATE POLICY tasks_insert ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- 수정: 생성자 또는 담당자
CREATE POLICY tasks_update ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    created_by  = auth.uid()
    OR assignee_id = auth.uid()
  )
  WITH CHECK (
    created_by  = auth.uid()
    OR assignee_id = auth.uid()
  );

-- 삭제: 생성자만
CREATE POLICY tasks_delete ON tasks
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());
