<?php
declare(strict_types=1);

require_once __DIR__ . '/jkfw-config.php';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$footer = jkfw_footer_data();
?>
  <footer class="jkhive-footer">
    <div class="jkhive-footer-inner">
      <div class="footer-left">
        <?php foreach ($footer['columns'] as $col) : ?>
        <div class="footer-col footer-col-site">
          <h4 class="footer-col-title"><?= $h((string) $col['title']) ?></h4>
          <ul class="footer-col-list">
            <?php foreach ($col['links'] as $ln) :
                /** @var array{label:string,href:string} $ln */
                ?>
            <li><a href="<?= $h((string) $ln['href']) ?>" class="footer-link"><?= $h((string) $ln['label']) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </div>
        <?php endforeach; ?>
      </div>
      <div class="footer-right">
        <div class="footer-corporate">
          <p class="small footer-copyright-line">
            <span class="footer-copyright-muted">&copy; </span>
            <a href="https://jkhive.work" class="footer-link" target="_blank" rel="noopener noreferrer">JK Hive 2016</a>
          </p>
          <p class="small">
            <span class="footer-copyright-muted">Desarrollado por </span>
            <a href="https://webs.jkhive.work" class="footer-link" target="_blank" rel="noopener noreferrer">JK WebS</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
