import 'package:flutter/material.dart';
import 'dart:math' as math;

class AppLogo extends StatelessWidget {
  final double size;
  const AppLogo({super.key, this.size = 80});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF4F7CFF), Color(0xFF8A5FE0)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(size * 0.28),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4F7CFF).withOpacity(0.4),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: CustomPaint(size: Size(size, size), painter: _LogoPainter()),
    );
  }
}

class _LogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.25)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    // Hexagonal rings
    for (int ring = 1; ring <= 2; ring++) {
      final path = Path();
      final r = size.width * 0.12 * ring;
      for (int i = 0; i < 6; i++) {
        final angle = (math.pi / 3) * i - math.pi / 6;
        final x = center.dx + r * math.cos(angle);
        final y = center.dy + r * math.sin(angle);
        if (i == 0) {
          path.moveTo(x, y);
        } else {
          path.lineTo(x, y);
        }
      }
      path.close();
      canvas.drawPath(path, paint);
    }

    // Pin head
    final iconPaint = Paint()..color = Colors.white;
    canvas.drawCircle(center, size.width * 0.1, iconPaint);

    // Pin teardrop body
    final dropPath = Path();
    dropPath.moveTo(
      center.dx - size.width * 0.07,
      center.dy + size.width * 0.02,
    );
    dropPath.quadraticBezierTo(
      center.dx,
      center.dy + size.height * 0.32,
      center.dx,
      center.dy + size.height * 0.32,
    );
    dropPath.quadraticBezierTo(
      center.dx,
      center.dy + size.height * 0.32,
      center.dx + size.width * 0.07,
      center.dy + size.width * 0.02,
    );
    canvas.drawPath(dropPath, iconPaint);

    // Hole in pin head
    final holePaint = Paint()..color = const Color(0xFF4F7CFF);
    canvas.drawCircle(center, size.width * 0.04, holePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
