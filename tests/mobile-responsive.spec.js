import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Design', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 13 size

  test('should display mobile layout with hamburger menu', async ({ page }) => {
    await page.goto('/');

    // Check for hamburger menu (mobile-only)
    const hamburger = page.locator('button.hamburger');
    await expect(hamburger).toBeVisible();

    // Check SVG hamburger icon is present
    const hamburgerSVG = hamburger.locator('svg');
    await expect(hamburgerSVG).toBeVisible();
  });

  test('should show month tabs on mobile', async ({ page }) => {
    await page.goto('/');

    // Month tabs should be visible
    const monthTabs = page.locator('.month-tabs');
    await expect(monthTabs).toBeVisible();

    // Check that active tab is highlighted
    const activeTab = page.locator('.month-tab.active');
    await expect(activeTab).toBeVisible();
    await expect(activeTab).toHaveText('Feb');
  });

  test('should allow month switching via tabs', async ({ page }) => {
    await page.goto('/');

    // Click on March tab
    await page.locator('.month-tab').filter({ hasText: 'Mar' }).click();

    // Verify March is now active
    const activeTab = page.locator('.month-tab.active');
    await expect(activeTab).toHaveText('Mar');

    // Verify month name in header updated
    const monthLabel = page.locator('div').filter({ hasText: /^March/ }).first();
    await expect(monthLabel).toBeVisible();
  });

  test('should show FAB button on mobile', async ({ page }) => {
    await page.goto('/');

    // FAB should be visible on mobile
    const fab = page.locator('button.fab');
    await expect(fab).toBeVisible();

    // Check FAB has correct aria-label
    await expect(fab).toHaveAttribute('aria-label', 'Create event');
  });

  test('should use single-letter day headers on mobile', async ({ page }) => {
    await page.goto('/');

    // Get all day headers
    const dayHeaders = page.locator('div[style*="gridTemplateColumns"]').first().locator('div');

    // First header should be single letter (S for Sunday)
    const firstHeader = dayHeaders.first();
    await expect(firstHeader).toHaveText(/^[SMTWF]$/);
  });

  test('should have compact event chips on mobile', async ({ page }) => {
    await page.goto('/');

    // Find a cell with events (Feb 2)
    const eventCells = page.locator('div[style*="minHeight: 88px"]').filter({ has: page.locator('div').filter({ hasText: /Tutoring|WRIT/ }) });
    const firstEventCell = eventCells.first();

    // Event chips should exist
    const eventChip = firstEventCell.locator('div').filter({ hasText: /Tutoring|KT|WRIT/ }).first();
    await expect(eventChip).toBeVisible();
  });

  test('should highlight today column on mobile', async ({ page }) => {
    await page.goto('/');

    // Check that today's day header is highlighted in blue
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayHeaders = page.locator('div[style*="gridTemplateColumns"]').first().locator('div');
    const todayHeader = dayHeaders.nth(dayOfWeek);

    // Today's header should have blue color
    await expect(todayHeader).toHaveCSS('color', /rgb\(26, 115, 232\)|#1a73e8/);
  });

  test('should center-align day numbers on mobile', async ({ page }) => {
    await page.goto('/');

    // Find any day cell
    const dayCell = page.locator('div[style*="minHeight: 88px"]').first();
    const dayNumber = dayCell.locator('div').first();

    // Day number container should have text-align center
    const textAlign = await dayNumber.evaluate(el => window.getComputedStyle(el).textAlign);
    expect(textAlign).toBe('center');
  });

  test('should not show desktop sidebar on mobile', async ({ page }) => {
    await page.goto('/');

    // Sidebar should not be visible (width 256px sidebar is desktop-only)
    const sidebar = page.locator('div[style*="width: 256"]');
    await expect(sidebar).not.toBeVisible();
  });

  test('should have maximum width of 430px on mobile', async ({ page }) => {
    await page.goto('/');

    // Main container should have max-width constraint
    const container = page.locator('div[style*="minHeight: 100vh"]').first();
    const maxWidth = await container.evaluate(el => window.getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('430px');
  });
});

test.describe('Desktop Responsive Design', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop size

  test('should hide mobile elements on desktop', async ({ page }) => {
    await page.goto('/');

    // Hamburger menu should not be visible
    const hamburger = page.locator('button.hamburger');
    await expect(hamburger).not.toBeVisible();

    // Month tabs should not be visible
    const monthTabs = page.locator('.month-tabs');
    await expect(monthTabs).not.toBeVisible();

    // FAB should not be visible
    const fab = page.locator('button.fab');
    await expect(fab).not.toBeVisible();
  });

  test('should show desktop sidebar', async ({ page }) => {
    await page.goto('/');

    // Sidebar should be visible on desktop
    const sidebar = page.locator('div[style*="width: 256"]');
    await expect(sidebar).toBeVisible();

    // Mini calendar should be in sidebar
    const miniCalendar = sidebar.locator('div').filter({ hasText: 'February 2026' }).first();
    await expect(miniCalendar).toBeVisible();
  });

  test('should use full day names in headers on desktop', async ({ page }) => {
    await page.goto('/');

    // Day headers should be full names
    const dayHeaders = page.locator('div[style*="gridTemplateColumns"]').first().locator('div');
    const firstHeader = dayHeaders.first();
    await expect(firstHeader).toHaveText('SUN');
  });

  test('should show event times on desktop', async ({ page }) => {
    await page.goto('/');

    // Find an event chip
    const eventChip = page.locator('div').filter({ hasText: /12:30pm|5:00pm/ }).first();

    // Event chip should contain time
    await expect(eventChip).toBeVisible();
    await expect(eventChip).toContainText(/\d{1,2}:\d{2}(am|pm)/);
  });

  test('should display "Kyle and Luka Calendar" title on desktop', async ({ page }) => {
    await page.goto('/');

    // Title should be visible
    const title = page.locator('span').filter({ hasText: 'Kyle and Luka Calendar' });
    await expect(title).toBeVisible();
  });
});

test.describe('Event Interaction', () => {
  test('should open event details on click', async ({ page }) => {
    await page.goto('/');

    // Click on a cell with events (Feb 2)
    const eventCell = page.locator('div').filter({ hasText: /KT \/ Dr/ }).first();
    await eventCell.click();

    // Event detail popup should appear
    const popup = page.locator('div[style*="position: fixed"]').filter({ has: page.locator('button').filter({ hasText: 'Close' }) });
    await expect(popup).toBeVisible();

    // Close button should be present
    const closeButton = popup.locator('button').filter({ hasText: 'Close' });
    await expect(closeButton).toBeVisible();
  });

  test('should close event details on close button click', async ({ page }) => {
    await page.goto('/');

    // Open event details
    const eventCell = page.locator('div').filter({ hasText: /KT \/ Dr/ }).first();
    await eventCell.click();

    // Click close button
    const closeButton = page.locator('button').filter({ hasText: 'Close' });
    await closeButton.click();

    // Popup should disappear
    const popup = page.locator('div[style*="position: fixed"]').filter({ has: page.locator('button').filter({ hasText: 'Close' }) });
    await expect(popup).not.toBeVisible();
  });
});

test.describe('Month Navigation', () => {
  test('should navigate to previous month on desktop', async ({ page, viewport }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Click previous month button
    const prevButton = page.locator('button').filter({ hasText: '‹' }).first();
    await prevButton.click();

    // Should show January
    const monthLabel = page.locator('span').filter({ hasText: /January 2026/ });
    await expect(monthLabel).toBeVisible();
  });

  test('should navigate to next month on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Click next month button
    const nextButton = page.locator('button').filter({ hasText: '›' }).first();
    await nextButton.click();

    // Should show March
    const monthLabel = page.locator('span').filter({ hasText: /March 2026/ });
    await expect(monthLabel).toBeVisible();
  });

  test('should return to current month with Today button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Navigate away from current month
    const nextButton = page.locator('button').filter({ hasText: '›' }).first();
    await nextButton.click();
    await nextButton.click();

    // Click Today button
    const todayButton = page.locator('button').filter({ hasText: 'Today' });
    await todayButton.click();

    // Should return to February 2026 (current month in test data)
    const monthLabel = page.locator('span').filter({ hasText: /February 2026/ });
    await expect(monthLabel).toBeVisible();
  });
});
